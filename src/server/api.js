
const router = require('express').Router()

import bj from '../blackjack'
import db from './database'
import eth from './eth'
import err from '../utils/err'

// check for an ethereum address in the query string
router.use('/register', (req, res, next) => {
  if (req.query && req.query.addr && req.query.addr.length === 42 && req.query.addr !== req.addr) {
    req.addr = req.query.addr
    db.saveAddress(req.id, req.addr).then(() => {
      console.log(`API: saved address ${req.addr} for ${req.id}`)
      req.json({
        message: `Ready to cashout to ${req.addr}`
      })
    }).catch(err)
  } else {
    req.json({
      fyi: `Oops, expected an ethereum address in the URL query`
    })
  }
})

router.get('/refresh', (req, res, next) => {
  eth.dealerData().then(dealer => {
    db.getState(req.id).then(doc => {
      const newState = bj(doc.state, { type: 'SYNC' })
      db.updateState(req.id, newState).then(() => {
        console.log(`API: eth & state data refreshed`)
        res.json(Object.assign(dealer, newState.public, {
          message: "Refresh successful!"
        }))
      })
    }).catch(err)
  }).catch(err)
})

router.get('/cashout', (req, res, next) => {
  db.getState(req.id).then(doc => {
    if (doc && doc.address) {
      db.cashout(req.id).then(() => {
        eth.cashout(doc.address, doc.state.public.chips).then(receipt => {
          res.json(Object.assign(receipt, {
            message: "Cashout successful!",
            chips: 0,
          }))
        }).catch(err)
      }).catch(err)
    } else {
      res.json({
        message: 'Please provide an address first'
      })
    }
  }).catch(err)
})


//////////////////////////////
// Generic function to handle each move

const handleMove = (req, res, move) => {

  console.log(`API: Handling ${move} for ${req.id}`)

  // insert this move into our log of all actions taken
  db.recordAction(req.id, move).then(() => {
    console.log(`API: inserted ${move} into db.actions`)
  }).catch(err)

  const newState = bj(req.state, { type: move })

  // insert the result of this move into our states collection
  db.updateState(req.id, newState).then(() => {
    res.json(newState.public)
  }).catch(err)

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
