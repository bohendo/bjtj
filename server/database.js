import fs from 'fs'
import mysql from 'mysql'

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

////////////////////////////////////////

var connection = mysql.createConnection({
  host: 'mysql',
  user: 'wordpress',
  password: fs.readFileSync('/run/secrets/wp_mysql','utf8'),
  database: 'wordpress'
})
connection.connect((err) => { if (err) die('connect()')(err) })

// Wrap MySQL's callback into a Promise
const query = (q) => {
  return new Promise( (resolve, reject) => {
    // TODO: deleted return below
    connection.query(q, (err, rows) => {
      if (err) return reject(err)
      return resolve(rows)
    })
  })
}

// Initialize the bjvm database tables
query(`CREATE TABLE IF NOT EXISTS bjvm_states (
  account   CHAR(42)      PRIMARY KEY,
  state     VARCHAR(2048) NOT NULL,
  timestamp DATETIME      NOT NULL);`)
query(`CREATE TABLE IF NOT EXISTS bjvm_actions (
  account   CHAR(42)      NOT NULL,
  action    VARCHAR(1024) NOT NULL,
  timestamp DATETIME      NOT NULL,
  PRIMARY KEY (account, timestamp));`)
query(`CREATE TABLE IF NOT EXISTS bjvm_players (
  account   CHAR(42)      PRIMARY KEY,
  signature VARCHAR(1024) NOT NULL,
  timestamp DATETIME      NOT NULL);`)

const db = { query }

db.newState = (account, state) => {
  const q = `INSERT INTO bjvm_states (account, state, timestamp) VALUES (
    '${account}',
    '${JSON.stringify(state)}',
    '${new Date().toISOString().slice(0,19).replace('T', ' ')}');`
  log(`Saving new state for ${account.substring(0,10)}...`)
  return ( query(q).catch(die(q)) )
}

db.getState = (account) => {
  const q = `SELECT state from bjvm_states WHERE account='${account}';`
  log(`Fetching state for ${account.substring(0,10)}...`)
  return ( query(q).then(res=>{
    // parse the saved state string to return an object
    return (res && res[0] && res[0].state) ? JSON.parse(res[0].state) : null
  }).catch(die(q)))
}

db.updateState = (account, state) => {
  const q = `UPDATE bjvm_states SET
    state='${JSON.stringify(state)}',
    timestamp='${new Date().toISOString().slice(0,19).replace('T', ' ')}'
    WHERE account='${account}';`
  log(`Updating state for ${account.substring(0,10)}...`)
  return ( query(q).catch(die(q)) )
}


db.saveAction = (account, action) => {
  const q = `INSERT INTO bjvm_actions (account, action, timestamp) VALUES (
    '${account}',
    '${JSON.stringify(action)}',
    '${new Date().toISOString().slice(0,19).replace('T', ' ')}');`
  log(`Recording action ${action} for account ${account.substring(0,10)}...`)
  return ( query(q).catch(die(q)) )
}


db.saveSig = (account, signature) => {
  const q = `INSERT INTO bjvm_players (account, signature, timestamp) VALUES (
    '${account}',
    '${signature}',
    '${new Date().toISOString().slice(0,19).replace('T', ' ')}');`
  log(`Saving autograph for ${account.substring(0,10)}...`)
  return ( query(q).catch(die(q)) )
}


db.cashout = (account) => {
  const q1 = `SELECT * FROM bjvm_states WHERE account='${account}';`
  return (query(q1).then((rows) => {
    if (rows.length === 0) die('cashout')(`Couldn't find state in db for ${account.substring(0,10)}..`)

    const state = JSON.parse(rows[0].state)
    const chipsReceived = state.public.chips
    state.public.chips = 0
    const q2 = `UPDATE bjvm_states SET state='${JSON.stringify(state)}' WHERE account='${account}';`
    log(`Account ${account.substring(0,10)}... cashed out`)
    // when everything's resolved, return the number of chips we removed from this account
    return ( query(q2).catch(die(q2)).then(() => chipsReceived) )
  }).catch(die(q1)))
}

// add some chips to a session's current pile
db.deposit = (account, chips) => {
  const q1 = `SELECT * FROM bjvm_states WHERE account='${account}';`
  return (query(q1).then((rows) => {
    if (rows.length === 0) die('deposit')(`Couldn't find state in db for ${account.substring(0,10)}..`)

    const state = JSON.parse(rows[0].state)
    state.public.chips += chips

    log(`Deposited ${chips} chips to ${account.substring(0,10)}...`)

    const q2 = `UPDATE bjvm_states SET state='${JSON.stringify(state)}' WHERE account='${account}';`
    return ( query(q2).catch(die(q2)) )
  }).catch(die(q1)))
}

export default db
