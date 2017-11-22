
import fs from 'fs'
import bj from '../blackjack'
import monk from 'monk'
import err from '../utils/err'

const mongodb = monk(`mongodb://bjvm:${
  fs.readFileSync('/run/secrets/mongo_user', 'utf8')
}@mongo:27017/bjvm`)

const q = false // q for quiet
const states = mongodb.get('states')
const actions = mongodb.get('actions')

const db = {}

// return gamestate for the given session
db.getState = (cookie) => {
  q || console.log(`DB: getting state for ${cookie}`)
  return states.findOne({ cookie }).catch(err)
}

// update this session's state
db.updateState = (cookie, state) => {
  q || console.log(`DB: updating state for ${cookie}`)
  return states.update({ cookie }, { $set: {
    state: state,
    timestamp: new Date(),
  }}).catch(err)
}

db.recordAction = (cookie, action) => {
  q || console.log(`DB: recording action ${action} for ${cookie}`)
  return actions.insert({
    cookie,
    action,
    timestamp: new Date(),
  }).catch(err)
}

db.newState = (cookie, state) => {
  q || console.log(`DB: replacing state for ${cookie}`)
  return states.insert({
    cookie,
    state,
    timestamp: new Date(),
  }).catch(err)
}

db.saveAddress = (cookie, address) => {
  q || console.log(`DB: saving address ${address} for ${cookie}`)
  return states.update({ cookie }, { $set: {
    address: address,
    timestamp: new Date(),
  }}).catch(err)
}

// What if multiple sessions are linked to this eth address?
// Return the one most recently used
db.getSession = (address) => {
  q || console.log(`DB: Getting the cookie linked to ${address}`)
  return states.find({
    address
  }, {
    sort: { timestamp: -1 }
  }).then(doc => {
    return doc[0]
  }).catch(err)
}

// add some chips to a session's current pile
db.cashout = (cookie) => {
  q || console.log(`DB: resetting ${cookie}'s chips to 0`)
  return states.update({ cookie }, {
    $set: { "state.public.chips": 0 }
  }).catch(err)
}

// add some chips to a session's current pile
db.deposit = (cookie, chips) => {
  q || console.log(`DB: depositing ${chips} chips to ${cookie}`)
  return states.update({ cookie }, {
    $inc: { "state.public.chips": Number(chips) }
  }).catch(err)
}

export default db
