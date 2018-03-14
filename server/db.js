import fs from 'fs'
import mysql from 'mysql'

import bj from './bj'

const pool = mysql.createPool({
  host: 'mysql',
  user: 'wordpress',
  password: fs.readFileSync('/run/secrets/wp_mysql','utf8'),
  database: 'wordpress',
  supportBigNumbers: true,
  bigNumberStrings: false // unless it's too big to cast to a Number()
})

////////////////////////////////////////
// Utility Functions

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

// Returns timestamp string in a format that MySQL understands
const now = () => {
  return (new Date().toISOString().slice(0,19).replace('T', ' '))
}

// Wrap MySQL's callback into a Promise
const query = (q) => {
  return new Promise((resolve, reject) => {
    pool.query(q, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

////////////////////////////////////////
// DB Initialization

query(`CREATE TABLE IF NOT EXISTS bjtj_states (
  account   CHAR(42)      PRIMARY KEY,
  signature CHAR(132)     NOT NULL,
  state     VARCHAR(2048) NOT NULL,
  timestamp DATETIME      NOT NULL);`)

query(`CREATE TABLE IF NOT EXISTS bjtj_actions (
  account   CHAR(42)      NOT NULL,
  action    VARCHAR(1024) NOT NULL,
  timestamp DATETIME      NOT NULL,
  PRIMARY KEY (account, timestamp));`)

// value column stores eth in units of micro Ether or 10^12 wei
// sender/recipient instead of from/to to avoid using MySQL reseved words
query(`CREATE TABLE IF NOT EXISTS bjtj_payments (
  hash      CHAR(66) PRIMARY KEY,
  sender    CHAR(42) NOT NULL,
  recipient CHAR(42) NOT NULL,
  value     BIGINT   NOT NULL,
  paid      TINYINT  NOT NULL,
  timestamp DATETIME NOT NULL);`)

// Confirm db connection or die
let q = `SELECT count(account) as count from bjtj_states;`
query(q).catch(die(q)).then(rows => {
  if (!rows || !rows[0]) die(q)(`Got an invalid db response: ${JSON.stringify(rows)}`)
  log(`Successfully connected to DB & found ${rows[0].count} bjtj states`)
})


////////////////////////////////////////
// Internal Helper Functions: SQL Queries

// Returns state object if it exists otherwise false
const selectState = (account) => {
  const a = account.toLowerCase() // a for lowercase Account
  const q = `SELECT state from bjtj_states WHERE account='${a}';`

  //log(`${a.substring(0, 10)} Selecting state`)
  return query(q).catch(die(q)).then((rows) => {
    if (rows && rows[0] && rows[0].state) {
      return JSON.parse(rows[0].state)
    }
    log(`${a.substring(0,10)} Couldn't find state: ${JSON.stringify(rows)}`)
    return false
  })
}

const initState = (account, signature) => {
  // a & s for lowercase Account & Signature
  const a = account.toLowerCase()
  const s = signature.toLowerCase()
  const state = mysql.escape(JSON.stringify(bj()))
  const q = `INSERT INTO bjtj_states
    ( account, signature,    state,  timestamp ) VALUES
    (  '${a}',    '${s}', ${state}, '${now()}' );`

  log(`${a.substring(0, 10)} Initializing new game state`)
  return query(q).catch(die(q)).then(() => bj())
}

const setState = (account, state) => {
  const a = account.toLowerCase() // a for lowercase Account
  const q = `UPDATE bjtj_states SET
    state=${mysql.escape(JSON.stringify(state))},
    timestamp='${now()}'
    WHERE account='${a}';`

  //log(`${a.substring(0,10)} Setting new state`)
  return query(q).catch(die(q)).then(() => state)
}

const insertPayment = (tx) => {
  // enforce all lowercase everything
  const hash = tx.hash.toLowerCase()
  const from = tx.from.toLowerCase()
  const to = tx.to.toLowerCase()
  const val = String(tx.value)
  const q = `INSERT INTO bjtj_payments
    (    hash,    sender, recipient,  value, paid, timestamp ) VALUES
    ( '${hash}', '${from}',   '${to}', ${val},    0, '${now()}');`

  log(`Saving payment of ${val} uETH from ${from.substring(0,10)} to ${to.substring(0,10)}`)
  return query(q).catch(die(q))
}

const selectPayments = (account) => {
  const a = account.toLowerCase()
  const q = `SELECT * from bjtj_payments
    WHERE paid=0 AND (sender='${a}' OR recipient='${a}');`

  //log(`${a.substring(0,10)} Selecting payments`)
  return query(q).catch(die(q)).then((rows) => {
    if (rows && rows[0]) {
      return (rows)
    }
    //log(`WARNING Didn't find any payments`)
    return (false)
  })
}

const setPaid = (hash) => {
  const q = `UPDATE bjtj_payments SET
    paid=1, timestamp='${now()}'
    WHERE hash='${hash.toLowerCase()}';`
  //log(`${hash.substring(0,10)} marking payment as paid`)
  return query(q).catch(die(q))
}

////////////////////////////////////////
// Define Exported Object
const db = {}

db.savePayment = (tx) => {
  if (tx && tx.hash && tx.from && tx.to && tx.value) {
    return insertPayment(tx)
  }
  log(`WARNING: DB NOT UPDATED, Recieved an invalid payment: ${JSON.stringify(tx)}`)
}

db.getState = (account, signature) => {
  return selectState(account).then(state => {
    return (state) ? state : initState(account, signature)
  }).catch(die)
}

db.move = (account, state, type) => {
  state = bj(state, { type })
  return setState(account, state).then(() => state)
}

db.message = (account, state, message) => {
  state.public.message = message
  return setState(account, state).then(() => state)
}

db.sync = (account, state) => {
  return new Promise((resolve, reject) => {

    return selectPayments(account).then((payments) => {
      if (!payments) { // Everything's up to date, bj(sync) and return
        state = bj(state, { type: 'SYNC' })
        return setState(account, state).then(() => resolve(state))
      }

      const promises = payments.map(payment => {
        // ignore any fractions of a mETH
        let chips = payment.value
        if (typeof chips === 'number') {
          chips = chips / 1000
        } else if (typeof chips === 'string') {
          chips = Number(chips.substring(0, chips.length-3))
        }
        if (payment.recipient === account) { chips *= -1 }

        state.public.chips += chips
        return setPaid(payment.hash).then(() => chips)
      })

      return Promise.all(promises).then((chips) => {
        log(`${account.substring(0,10)} Payments processed: [ ${chips} ] => ${state.public.chips}`)
        let newState = bj(state, { type: 'SYNC' })
        return setState(account, newState).then(() => resolve(newState))
      }).catch(reject)

    }).catch(reject)

  })
}


export default db
