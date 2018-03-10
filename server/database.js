import fs from 'fs'
import mysql from 'mysql'

import bj from './blackjack'

const connection = mysql.createConnection({
  host: 'mysql',
  user: 'wordpress',
  password: fs.readFileSync('/run/secrets/wp_mysql','utf8'),
  database: 'wordpress'
})

////////////////////////////////////////
// Utility Functions

// Global switch to turn [DB] logs on/off
const log = (msg) => {
  if (true) console.log(`${new Date().toISOString()} [DB] ${msg}`)
}

// We can recover from some errors
const warn = (query) => {
  return (msg) => {
    console.error(`${new Date().toISOString()} [DB] WARNING while executing: ${query}`)
    console.error(`${new Date().toISOString()} [DB] Error: ${msg}`)
  }
}

// Crash gracefully & informatively
const die = (query) => {
  return (msg) => {
    console.error(`${new Date().toISOString()} [DB] Fatal error while executing: ${query}`)
    console.error(`${new Date().toISOString()} [DB] Last words: ${msg}`)
    process.exit(1)
  }
}

const now = () => { return (new Date().toISOString().slice(0,19).replace('T', ' ')) }

// Wrap MySQL's callback into a Promise
const query = (q) => {
  return new Promise((resolve, reject) => {
    connection.query(q, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

////////////////////////////////////////
// DB Initialization

connection.connect((err) => { if (err) die('connect')(err) })

query(`CREATE TABLE IF NOT EXISTS bjvm_states (
  account   CHAR(42)      PRIMARY KEY,
  signature CHAR(132)     NOT NULL,
  state     VARCHAR(2048) NOT NULL,
  timestamp DATETIME      NOT NULL);`)

query(`CREATE TABLE IF NOT EXISTS bjvm_actions (
  account   CHAR(42)      NOT NULL,
  action    VARCHAR(1024) NOT NULL,
  timestamp DATETIME      NOT NULL,
  PRIMARY KEY (account, timestamp));`)

// Confirm db connection or die
let q = `SELECT count(account) as count from bjvm_states;`
query(q).catch(die(q)).then(rows => {
  if (!rows || !rows[0]) die(q)(`Got an invalid db response: ${JSON.stringify(rows)}`)
  log(`Successfully connected to DB & found ${rows[0].count} bjvm states`)
})


////////////////////////////////////////
// Internal Helper Functions

const selectState = (account) => {
  log(`${account.substring(0, 10)} SELECTing state`)
  const q = `SELECT state from bjvm_states WHERE account='${account}';`
  return query(q).catch(warn(q)).then((rows) => {
    if (rows && rows[0] && rows[0].state) {
      return JSON.parse(rows[0].state)
    }
    log(`${account.substring(0,10)} Couldn't find state: ${JSON.stringify(rows)}`)
    log(q)
    return false
  })
}

const initState = (account, signature) => {
  log(`${account.substring(0, 10)} Initializing new game state`)
  const state = bj()
  const stateString = connection.escape(JSON.stringify(state))
  const q = `INSERT INTO bjvm_states
    ( account,    signature,    state,    timestamp ) VALUES (
    '${account}', '${signature}', ${stateString}, '${now()}');`
  return query(q).catch(warn(q)).then(() => state)
}

const setState = (account, state) => {
  log(`${account.substring(0,10)} Updating state`)
  const q = `UPDATE bjvm_states SET
    state=${connection.escape(JSON.stringify(state))},
    timestamp='${now()}'
    WHERE account='${account}';`
  return query(q).catch(warn(q))
}

const reduceState = (account, reducer) => {
  return selectState(account).then((state) => {
    if (state) {
      const newState = reducer(state)
      return setState(account, newState).then(() => newState)
    } else {
      log(`${account} WARNING: Failed to update state, db not initialized`)
      return ({})
    }
  }).catch(die)
}

////////////////////////////////////////
// Define Exported Object
const db = {}

db.getState = (account, signature) => {
  return selectState(account).then(state => {
    return (state) ? state : initState(account, signature)
  }).catch(die)
}

db.action = (account, type) => {
  return reduceState(account, (state) => bj(state, { type }))
}

db.newMessage = (account, message) => {
  return reduceState(account, (state) => {
    state.public.message = message
    return state
  })
}

db.addChips = (account, chips) => {
  log(`${account.substring(0,10)} Adding ${chips} chips`)
  return reduceState(account, (state) => {
    state.public.chips += chips
    return state
  }).then(() => {
    return db.action(account, 'SYNC')
  })
}

export default db
