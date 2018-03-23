import express from 'express'

import bj from './bj'
import db from './db'
import eth from './eth'

////////////////////////////////////////
// Internal Utilities

const log = (msg) => {
  if (true) console.log(`${new Date().toISOString()} [API] ${msg}`)
}

const die = (msg) => {
  console.error(`${new Date().toISOString()} [API] Fatal: ${msg}`)
  process.exit(1)
}

const handleMove = (req, res, move) => {
  return db.move(req.id, req.state, move).catch(die)
    .then(newState => res.json(newState.public)).catch(die)
}

////////////////////////////////////////
// Define Exported Object
const router = express.Router()

router.get('/deal',   (req, res, next) => { handleMove(req, res, 'DEAL') })
router.get('/hit',    (req, res, next) => { handleMove(req, res, 'HIT') })
router.get('/double', (req, res, next) => { handleMove(req, res, 'DOUBLE') })
router.get('/stand',  (req, res, next) => { handleMove(req, res, 'STAND') })
router.get('/split',  (req, res, next) => { handleMove(req, res, 'SPLIT') })

router.get('/refresh', (req, res, next) => {
  return db.sync(req.id, req.state).catch(die)
    .then(newState => res.json(newState.public))
})

router.get('/cashout', (req, res, next) => {

  var th = 0.01 // balance below this is basically 0
  var player = req.id.substring(0,10)
  var chips = req.state.public.chips

  log(`${player} wants to cash out ${chips} chips`)

  const message = "Hey you don't have any chips"
  if (req.state.public.chips < th) {
    log(`${player} doesn't have any chips`)
    return res.json({ message })
  }

  return eth.getDealerBalance().then((dealerBal) => {

    const message = "Oh no, the dealer's broke.. Try again later"
    if (dealerBal < th) {
      log(`WARNING Dealer's broke, ${player} couldn't cash out`)
      return res.json({ message })
    }

    var toCash = (dealerBal > chips) ? chips : dealerBal
    return eth.cashout(req.id, toCash).then((txHash) => {

      const message = `Cashout tx: ${txHash}`
      log(message)

      // if we successfully send a tx, subtract some chips from the player's game state
      return db.sync(req.id, req.state).then((newState) => {
        return db.message(req.id, newState, message).then((newerState) => {

          return res.json(newerState.public)

        }).catch(die)
      }).catch(die)

    }).catch(die)
  }).catch(die)

})

export default router
