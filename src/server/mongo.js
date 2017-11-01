
import fs from 'fs'
import monk from 'monk'

const bjdb = monk(`mongodb://bjvm:${
  fs.readFileSync('/run/secrets/mongo_user', 'utf8')
}@mongo:27017/bjvm`)

const db = {
  'states':  bjdb.get('states'),
  'actions': bjdb.get('actions'),
}

export default db
