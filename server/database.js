import fs from 'fs'
import mysql from 'mysql'

import bj from './blackjack'

////////////////////////////////////////
// Internal Utilities

// Global switch to turn [DB] logs on/off
const log = (msg) => {
  if (true) console.log(`${new Date().toISOString()} [DB] ${msg}`)
}

// Crash gracefully & informatively
const die = (query) => {
  return (msg) => {
    console.error(`${new Date().toISOString()} [DB] Fatal error while executing: ${query}`)
    console.error(`${new Date().toISOString()} [DB] Last words: ${msg}`)
    process.exit(1)
  }
}

const connection = mysql.createConnection({
  host: 'mysql',
  user: 'wordpress',
  password: fs.readFileSync('/run/secrets/wp_mysql','utf8'),
  database: 'wordpress'
})

// Wrap MySQL's callback into a Promise
const query = (q) => {
  return new Promise( (resolve, reject) => {
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
// Define Exported Object
const db = {}

db.getState = (account, signature) => {
  const q1 = `SELECT state from bjvm_states WHERE account='${account}';`
  return query(q1).catch(die(q1)).then(rows=>{
    // parse the saved state string to return an object
    if (rows && rows[0] && rows[0].state) {
      log(`Fetched state for ${account.substring(0,10)}`)
      return JSON.parse(rows[0].state)
    }
    // insert a new state if one doesn't exist yet
    const newState = bj()
    const q2 = `INSERT INTO bjvm_states (account, signature, state, timestamp) VALUES (
      '${account}', '${signature}',
      ${connection.escape(JSON.stringify(newState))},
      '${new Date().toISOString().slice(0,19).replace('T', ' ')}');`
    // return our new state after inserting it
    return query(q2).catch(die(q2)).then(() => newState)
  })
}

db.updateState = (account, state) => {
  log(`Updating state for ${account.substring(0,10)}`)
  const q = `UPDATE bjvm_states SET
    state=${connection.escape(JSON.stringify(state))},
    timestamp='${new Date().toISOString().slice(0,19).replace('T', ' ')}'
    WHERE account='${account}';`
  return query(q).catch(die(q))
}

db.saveAction = (account, action) => {
  log(`Recording action ${action} for account ${account.substring(0,10)}`)
  const q = `INSERT INTO bjvm_actions (account, action, timestamp) VALUES (
    '${account}', ${connection.escape(JSON.stringify(action))},
    '${new Date().toISOString().slice(0,19).replace('T', ' ')}');`
  return query(q).catch(die(q))
}

db.cashout = (account, receipt) => {
  const q1 = `SELECT state FROM bjvm_states WHERE account='${account}';`
  return query(q1).catch(die(q1)).then((rows) => {
    if (!rows || !rows[0] || !rows[0].state) {
      die('cashout')(`Couldn't find state for ${account.substring(0,10)}`)
    }

    const state = JSON.parse(rows[0].state)

    state.public.chips -= receipt.chipsCashed
    state.public.message = `Cashed out ${receipt.chipsCashed} chips: ${receipt.transactionHash}`

    log(`Removed ${receipt.chipsCashed} chips from account ${account.substring(0,10)}`)

    // when promises resolve, return the new state we just saved
    const q2 = `UPDATE bjvm_states
      SET state=${connection.escape(JSON.stringify(state))},
      timestamp='${new Date().toISOString().slice(0,19).replace('T', ' ')}'
      WHERE account='${account}';`
    return query(q2).catch(die(q2)).then(() => state)
  })
}

// add some chips to an address's pile
db.deposit = (account, chips) => {
  const q1 = `SELECT state FROM bjvm_states WHERE account='${account}';`
  return query(q1).catch(die(q1)).then((rows) => {
    if (!rows || !rows[0] || !rows[0].state) {
      die('deposit')(`Couldn't find state in db for ${account.substring(0,10)}`)
    }

    const state = JSON.parse(rows[0].state)
    state.public.chips += chips
    log(`Deposited ${chips} chips to ${account.substring(0,10)}`)

    // when promises resolve, return the number of chips we added to this account
    const q2 = `UPDATE bjvm_states
      SET state=${connection.escape(JSON.stringify(bj(state, { type: 'SYNC' })))},
      timestamp='${new Date().toISOString().slice(0,19).replace('T', ' ')}'
      WHERE account='${account}';`
    return query(q2).catch(die(q2)).then(() => chips)
  })
}

export default db
