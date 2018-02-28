import fs from 'fs'
import mysql from 'mysql'

const die = (msg) => {
  console.error(`${new Date().toISOString()} Fatal: ${msg}`)
  process.exit(1)
}

var connection = mysql.createConnection({
  host: 'mysql',
  user: 'wordpress',
  password: fs.readFileSync('/run/secrets/wp_mysql','utf8'),
  database: 'wordpress'
})
connection.connect((err) => { if (err) die(err) })

const query = (q) => {
  return new Promise( (resolve, reject) => {
    return connection.query(q, (err, rows) => {
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
  const q = `INSERT INTO bjvm_states (account, state, timestamp)
    VALUES ('${account}',
    '${JSON.stringify(state)}',
    '${new Date().toISOString().slice(0,19).replace('T', ' ')}');`

  console.log(`${new Date().toISOString()} ${q}`)
  return ( query(q).catch(die) )
}

db.getState = (account) => {
  const q = `SELECT * from bjvm_states WHERE account='${account}';`

  console.log(`${new Date().toISOString()} ${q}`)
  return ( query(q).then(res=>JSON.parse(res[0])).catch(die))
}

db.updateState = (account, state) => {
  const q = `UPDATE bjvm_states SET state='${JSON.stringify(state)}',
    timestamp='${new Date().toISOString().slice(0,19).replace('T', ' ')}');`

  console.log(`${new Date().toISOString().slice(0,19).replace('T', ' ')} ${q}`)
  return ( query(q).catch(die) )
}


db.saveAction = (account, action) => {
  const q = `INSERT INTO bjvm_actions (account, action, timestamp)
    VALUES ('${account}',
    '${JSON.stringify(action)}',
    '${new Date().toISOString().slice(0,19).replace('T', ' ')}');`

  console.log(`${new Date().toISOString()} ${q}`)
  return ( query(q).catch(die) )
}


db.saveSig = (account, signature) => {
  const q = `INSERT INTO bjvm_players (account, signature, timestamp)
    VALUES ('${account}',
    '${signature}',
    '${new Date().toISOString().slice(0,19).replace('T', ' ')}');`

  console.log(`${new Date().toISOString()} ${q}`)
  return ( query(q).catch(die) )
}


db.cashout = (account) => {
  return (query(`SELECT * FROM bjvm_signatures where account='${account}';`).then((rows) => {
    // What if this account doesn't exist?!
    const state = JSON.parse(rows[0])
    state.public.chips = 0
    const q = `UPDATE bjvm_states SET state='${JSON.stringify(state)}';`
    console.log(`${new Date().toISOString()} ${q}`)
    return ( query(q).catch(die) )
  }).catch(die))
}

// add some chips to a session's current pile
db.deposit = (account, chips) => {
  return (query(`SELECT * FROM bjvm_signatures where account='${account}';`).then((rows) => {
    // What if this account doesn't exist?!
    const state = JSON.parse(rows[0])
    state.public.chips += chips
    const q = `UPDATE bjvm_states SET state='${JSON.stringify(state)}';`
    console.log(`${new Date().toISOString()} ${q}`)
    return ( query(q).catch(die) )
  }).catch(die))
}

export default db
