import crypto from "crypto"

const access_key = crypto.randomBytes(32).toString('hex')
const refresh_key = crypto.randomBytes(32).toString('hex')

console.table({access_key, refresh_key})