import fs from 'fs'
import bj from '../blackjack'
import err from '../utils/err'
import mysql from 'mysql'

var connection = mysql.createConnection({
  host: 'mysql',
  user: 'bjvm',
  password: fs.readFileSync('/run/secrets/bjvm_mysql','utf8'),
  database: 'bjvm'
})

connection.connect(err=>{
  if (err) console.error(err)
  console.log(`connected with id ${connection.threadId}`)
})

connection.query('SELECT 1 + 1 AS solution', (err, res, fld) => {
  if (err) console.error(err)
  console.log('the solution is:', res[0].solution)
})

const q = false // q for quiet
const db = {}

// return gamestate for the given session
db.getState = (cookie) => {
  q || console.log(`DB: getting state for ${cookie}`)
  // return states.findOne({ cookie }).catch(err)
}

// update this session's state
db.updateState = (cookie, state) => {
  q || console.log(`DB: updating state for ${cookie}`)
  // return states.update({ cookie }, { $set: { state: state, timestamp: new Date(), }}).catch(err)
}

db.recordAction = (cookie, action) => {
  q || console.log(`DB: recording action ${action} for ${cookie}`)
  // return actions.insert({ cookie, action, timestamp: new Date(), }).catch(err)
}

db.newState = (cookie, state) => {
  q || console.log(`DB: replacing state for ${cookie}`)
  // return states.insert({ cookie, state, timestamp: new Date(), }).catch(err)
}

db.saveAddress = (cookie, address) => {
  q || console.log(`DB: saving address ${address} for ${cookie}`)
  // return states.update({ cookie }, { $set: { address: address, timestamp: new Date(), }}).catch(err)
}

// What if multiple sessions are linked to this eth address?
// Return the one most recently used
db.getSession = (address) => {
  q || console.log(`DB: Getting the cookie linked to ${address}`)
  // return states.find({ address }, { sort: { timestamp: -1 } }).then(doc => { return doc[0] }).catch(err)
}

// add some chips to a session's current pile
db.cashout = (cookie) => {
  q || console.log(`DB: resetting ${cookie}'s chips to 0`)
  // return states.update({ cookie }, { $set: { "state.public.chips": 0 } }).catch(err)
}

// add some chips to a session's current pile
db.deposit = (cookie, chips) => {
  q || console.log(`DB: depositing ${chips} chips to ${cookie}`)
  // return states.update({ cookie }, { $inc: { "state.public.chips": Number(chips) } }).catch(err)
}

db.saveFeedback = (cookie, data) => {
  q || console.log(`DB: saving feedback from ${cookie}: ${JSON.parse(data).feedback}`)
  // return db.getState(cookie).then(state=>{ return feedback.insert({ cookie, state, feedback: JSON.parse(data), }).catch(err) }).catch(err)
}

export default db
