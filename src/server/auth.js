
// Node built-ins
import crypto from 'crypto'

// My modules
import bj from '../blackjack'
import db from './database'
import err from '../utils/err'

const auth = (req, res, next) => {
  console.log(`=====\nAUTH: new req received for ${req.path}`)
  const id = req.universalCookies.get('id')

  // have I tagged this client with a cookie yet?
  if (id && id.length === 16) {
    console.log(`AUTH: found old friend ${id}`)
    req.id = id
    db.getState(req.id).then(doc => {
      if (doc && doc.state) {
        req.state = doc.state
        req.address = doc.address
        next()
      } else {
        req.state = bj()
        db.newState(req.id, req.state).then(() => next()).catch(err)
      }
    }).catch(err)

  // tag this client with a cookie
  } else {

    const hash = crypto.createHash('sha256');
    hash.update(req.headers['user-agent'].toString())
    hash.update(Date.now().toString())
    hash.update(crypto.randomBytes(16))
    req.id = hash.digest('hex').substring(0,16)

    console.log(`AUTH: Found new friend ${req.id}`)

    const mspery = 365*24*60*60*1000 // milliseconds per year
    res.cookie('id', req.id, {
      'expires': new Date(Date.now() + mspery),
      'maxAge': mspery,
      'secure': true,
      'httpOnly': true,
      'sameSite': true,
    })

    req.state = bj()
    db.newState(req.id, req.state).then(() => next()).catch(err)
  }
}

export default auth
