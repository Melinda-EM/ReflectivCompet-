import Cookies from "universal-cookie"

const cookies = new Cookies()

const COOKIE_NAME = "reflectiv-championship.sid"

export function isConnected() {
  const session = cookies.get(COOKIE_NAME)
  return !!session
}
