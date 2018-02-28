import db from './database'
import sigUtil from 'eth-sig-util'

// Propose an agreement to the user
const agreement = [ // 33 char column limit
  "I understand and agree that",
  "this game is an elaborate tip jar.",
  "Although I expect to be able to",
  "exchange my chips for Ether,",
  "I am at peace knowing that the",
  "site owner may, at any time and",
  "for any reason, be unable or",
  "unwilling to refund my chips."
]
const toSign = [{ type: 'string', name: 'Agreement', value: agreement.join(' ') }]

const auth = (req, res, next) => {
  console.log(`${new Date().toISOString()} AUTH: new req received for ${req.path}`)

  let id = req.universalCookies.get('bjvm_id') // id for IDentifier aka account
  let ag = req.universalCookies.get('bjvm_ag') // ag for AutoGraph aka signature
  if (! id || id.length !== 42 || ! ag || ag.length !== 132) { // or id is a valid eth address or ag isn't valid
    console.log(`${new Date().toISOString()} no signature, aborting...`)
    return res.json({ message: "I need your autograph before you can play" })
  }

  id = id.toLowerCase()
  ag = ag.toLowerCase()

  // verify signature
  const signer = sigUtil.recoverTypedSignature({ data: toSign, sig: ag }).toLowerCase()

  if (signer !== id) { // autograph is valid
    console.log(`${new Date().toISOString()} Player ${id} provided an invalid signature`)
    return res.json({ message: "Sorry bud, this autograph don't look right" })
  }

  db // save this id & ag in our database if it's not there already
  .query(`SELECT * FROM bjvm_players where account='${id}';`)
  .then(rows=>{ if (rows.length === 0) db.saveSig(id, ag) }) 
  .catch(console.error)

  console.log(`${new Date().toISOString()} Player ${id} Successfully Authenticated!`)
  return next()
}

export default auth
