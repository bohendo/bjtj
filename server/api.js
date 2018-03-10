import express from 'express'

import bj from './blackjack'
import db from './database'
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
  log(`Handling ${move} for ${req.id.substring(0,10)}`)

  return db.action(req.id, move).then((newState) => {

    return res.json(newState.public)

  }).catch(die)
}

////////////////////////////////////////
// Define Exported Object
const router = express.Router()

// Triggered the first time a player autographs our agreement
router.get('/autograph', (req, res, next) => {
  log(`New autograph received, player ${req.id.substring(0,10)} is ready to go`)
  return res.json({ message: "Thanks for the autograph!", authenticated: true })
})

router.get('/refresh', (req, res, next) => {
  db.action(req.id, 'SYNC').then((newState) => {
    log(`Refreshed game state for ${req.id.substring(0,10)}`)

      return res.json(newState.public)

  }).catch(die)
})

router.get('/cashout', (req, res, next) => {

  const message = "Hey you don't have any chips"
  if (req.state.public.chips < 1) {
    log(`${req.id.substring(0,10)} doesn't have any chips to cash out`)
    return res.json({ message })
  }

  return eth.getDealerBalance().then((dealerBal) => {

    const message = "Oh no, the dealer's broke.. Try again later"
    if (dealerBal < 1) {
      log(`WARNING Dealer's broke, ${req.id.substring(0,10)} couldn't cash out`)
      return res.json({ message })
    }

    const playerBal = req.state.public.chips
    var toCash = (dealerBal > playerBal) ? playerBal : dealerBal
    log(`Cashing out ${toCash} (Dealer has ${dealerBal} vs Player has ${playerBal})`)

    return eth.cashout(req.id, toCash).then((txHash) => {

      const message = `Cashout tx: ${txHash}`
      log(message)

      // if we successfully send a tx, subtract some chips from the player's game state
      db.addChips(req.id, -1 * toCash).then((newState) => {
        db.newMessage(req.id, message).then((newState) => {

          return res.json(newState.public)

        }).catch(die)
      }).catch(die)

    }).catch(die)
  }).catch(die)

})

router.get('/deal',   (req, res, next) => { handleMove(req, res, 'DEAL') })
router.get('/hit',    (req, res, next) => { handleMove(req, res, 'HIT') })
router.get('/double', (req, res, next) => { handleMove(req, res, 'DOUBLE') })
router.get('/stand',  (req, res, next) => { handleMove(req, res, 'STAND') })
router.get('/split',  (req, res, next) => { handleMove(req, res, 'SPLIT') })

export default router
