import express from 'express'

import bj from './blackjack'
import db from './database'
import eth from './eth'

const router = express.Router()

const die = (msg) => {
  console.error(`${new Date().toISOString()} [API] Fatal: ${msg}`)
  process.exit(1)
}

const log = (msg) => {
  console.log(`${new Date().toISOString()} [API] ${msg}`)
}

////////////////////////////////////////

router.get('/autograph', (req, res, next) => {
  log(`Autograph received`)
  return res.json({ message: "Thanks for the autograph!", authenticated: true })
})

router.get('/refresh', (req, res, next) => {
  eth.dealerData().then(dealer => {
    db.getState(req.id).then(state => {

      const newState = bj(state, { type: 'SYNC' })
      db.updateState(req.id, newState).then(() => {
        log(`Refreshed eth & state data`)
        res.json(Object.assign(dealer, state.public, { message: undefined }))
      })

    }).catch(die)
  }).catch(die)
})

router.get('/cashout', (req, res, next) => {
  db.cashout(req.id).then((chips) => {

    if (chips === 0) {
      return res.json({ message: "No chips to cashout" })
    }

    log(`DB deleted ${chips} chips from ${req.id.substring(0,10)}.., time for ETH to send some mETH`)
    eth.cashout(req.id, chips).then(receipt => {

      return res.json({ message: "Cashout successful!", chips: 0 })

    }).catch(die)
  }).catch(die)
})


//////////////////////////////
// Generic function to handle each move

const handleMove = (req, res, move) => {

  log(`Handling ${move} for ${req.id.substring(0,10)}..`)

  // get this player's old state or initialize a new one
  return db.getState(req.id).then(state=>{

    // if this player doesn't have a bj state yet...
    if (state && typeof state === 'object') {
      
      // use our bj reducer to generate the state after applying some move
      const newState = bj(state, { type: move })
      return db.updateState(req.id, newState).then(() => {
        // send off this bj state after it's been saved in our db
        return res.json(newState.public)
      }).catch(die)

    // if this player has a saved bj state...
    } else {

      // create a clean new blackjack state
      const newState = bj()
      return db.newState(req.id, newState).then(() => {
        // send off this bj state after it's been saved in our db
        return res.json(newState.public)
      })

    }


  })

}

//////////////////////////////
// Apply above function to each move

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
