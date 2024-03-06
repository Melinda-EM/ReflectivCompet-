import bcrypt from "bcryptjs"

export function hash(password) {
    const salt = bcrypt.genSaltSync(12);
    return bcrypt.hashSync(password, salt);
}

export function verify(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
}
