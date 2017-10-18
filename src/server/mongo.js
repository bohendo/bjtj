
import fs from 'fs'
import monk from 'monk'

// const auth = fs.readFileSync('./admin/.mongo.secret', 'utf8').replace(/\n/, '')

const bjdb = monk(

  // 'mongodb://user:password@host:port/database'
  // `mongodb://bjvm:${auth}@127.0.0.1:27017/bjvm`,
  `mongodb://bjvm:@127.0.0.1:27017/bjvm`,

  // monk arg2: error callback
  (err) => { if (err) console.error(err); }
)

const states = bjdb.get('states')
const actions = bjdb.get('actions')

const db = { states, actions }

export default db
