import express, { json } from "express";
import ViteExpress from "vite-express";
import session from "express-session";
import process from "node:process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os"
import multer from "multer"
import { hash, verify } from "./hasher.js";
import { z } from "zod"

const  __filename = fileURLToPath(import.meta.url);
const  __dirname = path.dirname(__filename);

const RESOURCE_PATH = path.resolve(__dirname, "../../resources");
if (!fs.existsSync(RESOURCE_PATH)) fs.mkdirSync(RESOURCE_PATH);

const ENV = {
  MODE:process.env.MODE,
  SESSION_SECRET:process.env.SESSION_SECRET,
  SESSION_MAX_AGE:process.env.SESSION_MAX_AGE,
  CREATE_ADMIN_PASS:process.env.CREATE_ADMIN_PASS
}

if (ENV.MODE === "dev") {
  console.log("Running in dev mode");
}

const app = express();
app.use(json())
app.use(session({
  secret:ENV.SESSION_SECRET,
  cookie: { 
    maxAge: parseInt(ENV.SESSION_MAX_AGE), 
    secure:ENV.MODE==='prod',
  },
  name: "reflectiv-championship.sid"
}))

function adminRestrict(req, res, next) {
  if (!req.session.user){
    next(new Error("401 Admin restricted page"));
  }else{
    req.user = req.session.user;
    next();
  }
}

app.post("/api/admin", (req, res) => {
  const credsFile = path.join(RESOURCE_PATH, "/creds.json");
  if (fs.existsSync(credsFile)) {
    throw new Error("403 Credentials already exist.");
  }

  const { createPassword, username, password } = req.body
  if (createPassword === null || createPassword !== ENV.CREATE_ADMIN_PASS) {
    throw new Error("403 Invalid credentials for creating admin account.")
  }

  if (!username || !password){
    throw new Error("400 Invalid body")
  }

  const hashedPassword = hash(password);
  fs.writeFileSync(credsFile, JSON.stringify({ username, password: hashedPassword }));

  res.send("200 Created admin successfully")
})

app.post("/api/login", (req, res) => {
  const credsFile = path.join(RESOURCE_PATH, "/creds.json");
  if (!fs.existsSync(credsFile)) {
    throw new Error("403 No one to login");
  }

  const {username, password} = req.body
  if (!username || !password){
    throw new Error("400 Invalid body")
  }

  const creds = JSON.parse(fs.readFileSync(credsFile))
  if (username !== creds.username || !verify(password, creds.password)) {
    throw new Error("403 Wrong Username or Password");
  }

  req.session.user = username

  res.send("200 Login success")
})

app.delete("/api/logout", adminRestrict, (req, res) => {
  delete req.session.user
  req.session.destroy()
  res.send("200 Logged out")
})

const statFileSchema = z.tuple([
  z.object({ 
    type: z.string(), 
    name: z.string()
  }),
  z.object({
    type: z.string(),
    data: z.array(z.object({ 
      employee: z.string(), 
      order_count: z.string(),
      total_paid: z.string()
    }))
  }),
])

const upload = multer({ dest: os.tmpdir() })
app.post("/api/upload", adminRestrict, upload.single("file"), (req, res) => {
  const date = req.query.date
  const file = req.file
  if (!date) throw new Error("400 Missing 'date'")
  if (!file) throw new Error("400 Missing file")

  // date : dd-mm-yyyy
  if  (!/^([01]\d|2[0-3])-(0[1-9]|1[0-2])-(19|20)\d\d$/.test(date)) {
    throw new Error("400 Invalid 'date' (dd-mm-yyyy)")
  }

  // TODO validate file
  let data 
  try{
   data = statFileSchema.parse(JSON.parse(fs.readFileSync(file.path))) 
  } catch{
    throw new Error ("400 Invalid file")
  }
  
  data = data
    .filter((item) => item.type === "table") 
    .flatMap((item) => {
      return item.data.map((employeeData) => {
        return {
          employee: employeeData.employee,
          value: parseFloat(employeeData.total_paid), 
        };
      });
    });

  const dataDir = path.join(RESOURCE_PATH, "data")
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)
  fs.writeFileSync(path.join(dataDir, `${date}.json`), JSON.stringify(data));

  res.send("200 Success")
})

app.get("/api/ranking", (req, res) => {
  const dataDir = path.join(RESOURCE_PATH, "data")
  const allStats = fs.readdirSync(dataDir)
    .map((fname) => fs.readFileSync(path.join(dataDir, fname),  "utf8"))
    .flatMap((content) => JSON.parse(content))
    .reduce((acc, val) => ({
      ...acc,
      [val.employee]: acc[val.employee] ? acc[val.employee] + val.value : val.value
    }), {})

  const asArray = Object.entries(allStats).map(([employee, value]) => ({ employee, value }))

  res.json(asArray)
})

app.use((err, req, res, next) => {
  const message = err.message
  const code = message.slice(0, 3)
  console.error(err);
  try {
    res.status(parseInt(code)).json({error: message})
  } catch (_) {
    if (err.type === "entity.parse.failed") {
      res.status(400).json({ error: "Invalid Body"})
    } else {
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
})

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
