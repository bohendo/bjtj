import db from './database'
import sigUtil from 'eth-sig-util'
import agreement from '../Agreement.txt'

////////////////////////////////////////
// Internal Utilities

const log = (msg) => {
  if (true) console.log(`${new Date().toISOString()} [AUTH] ${msg}`)
}

const verify = (usr, sig) => {
  const signee = sigUtil.recoverTypedSignature({
    data: [{ type: 'string', name: 'Agreement', value: agreement }],
    sig
  })
  return (signee.toLowerCase() === usr.toLowerCase())
}

////////////////////////////////////////
// Define Exported Object

const auth = (req, res, next) => {
  log(`New req received for ${req.path}`)

  // Make sure this request has id and ag cookies
  let id = req.cookies.bjvm_id // id for IDentifier aka eth address
  let ag = req.cookies.bjvm_ag // ag for AutoGraph aka signature
  if (! id || ! ag) {
    log(`No signature cookies, aborting`)
    return res.json({ message: "I dont' talk to people without a cookie" })
  }

  id = id.toLowerCase()
  ag = ag.toLowerCase()

  // Make sure both the id and ag cookies are properly formatted
  if (!id.match(/0x[0-9a-f]{40}/) || !ag.match(/0x[0-9a-f]{130}/)) {
    log(`These cookies are invalid, aborting`)
    return res.json({ message: "These cookies don't look right" })
  }

  if (!verify(id, ag)) { // autograph is valid
    log(`Player ${id.substring(0,10)} provided an invalid signature`)
    return res.json({ message: "Hey this cookie wasn't autographed by you" })
  }

  log(`Player ${id.substring(0,10)} Successfully Authenticated!`)

  req.id = id
  req.ag = ag

  // ensure this player's bj gamestate has been initialized
  // getState will return an existing gamestate or create & return a new one
  return db.getState(req.id, req.ag).then((state) => {
    req.state = state
    return next()
  })

}

export default auth
