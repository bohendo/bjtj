
import fs from 'fs'
import monk from 'monk'

const pwd = fs.readFileSync('/run/secrets/mongo_user', 'utf8').replace(/\n/, '')

const bjdb = monk(

  // 'mongodb://user:password@host:port/database'
  `mongodb://bjvm:${pwd}@mongo:27017/bjvm`,

  // monk arg2: error callback
  (err) => { if (err) console.error(err); }
)

const states = bjdb.get('states')
const actions = bjdb.get('actions')

actions.find({}).then((doc) => {
  console.log("DB LOADED: ", doc)
})

const db = { states, actions }

export default db
