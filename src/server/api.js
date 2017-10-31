
// Node built-in
import crypto from 'crypto'

const router = require('express').Router()

import blackjack from '../reducers'
import db from './mongo'

const handleMove = (req, res, move) => {



  let id = req.universalCookies.get('id')
  if (!id) {
    res.send('Who in tarnation do you think you are?!')
  } else {

    console.log("got move", move, "for id", id)

    db.actions.insert({ cookie: id, action: { type: move } })

    db.states.findOne({ cookie: id }).then((doc) => {

      if (!doc) {
        res.json({ message: "ERROR: id ${id} not found in db" })
      }

      const newState = blackjack(doc.state, { type: move })

      db.states.update(
        { cookie: id },
        { cookie: id, state: newState }
      ).then(() => {
        res.json(newState)
      }).catch((e) => { console.error(e) })

    }).catch((e) => { console.error(e) })
  }

}

//////////////////////////////
// Setup router pipeline

router.get('/hello', (req, res, next) => {
  
  let id = req.universalCookies.get('id')

  if (id) {
    db.states.findOne({ cookie: id }).then((doc) => {
      if (doc && doc.state) {
        // Found an old user with saved state: return that and we're done
        console.log(`Old user detected with id ${id}`)
        res.json(doc.state)
      } else {
        // Found an old user WITHOUT saved state: continue
        console.log(`Unregistered id detected: ${id}`)
      }
    }).catch((e) => { console.error(e) })

  } else {
    const hash = crypto.createHash('sha256');
    hash.update(req.headers['user-agent'].toString())
    hash.update(Date.now().toString())
    hash.update(crypto.randomBytes(16))
    id = hash.digest('hex')
  }

  const newState = blackjack(undefined, { type: 'HELLO' })

  // save a bj doc in mongo for this user
  db.actions.insert({ cookie: id, action: { type: 'HELLO' }})
  db.states.insert({ cookie: id, state: newState, })

  // and send a copy to them
  res.cookie('id', id)
  res.send('New state generated')
  console.log(`New user registered with with id ${id}`)
})

router.get('/deal', (req, res, next) => {
  handleMove(req, res, 'DEAL')
})

router.get('/hit', (req, res, next) => {
  handleMove(req, res, 'HIT')
})

router.get('/double', (req, res, next) => {
  handleMove(req, res, 'DOUBLE')
})

router.get('/stand', (req, res, next) => {
  handleMove(req, res, 'STAND')
})

router.get('/split', (req, res, next) => {
  handleMove(req, res, 'SPLIT')
})

export default router
