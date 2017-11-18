
// Node built-in
import crypto from 'crypto'

const router = require('express').Router()

import { err } from '../utils'
import bj from '../blackjack'
import db from './mongo'
import eth from './eth'


router.get('/refresh', (req, res, next) => {
  eth().then((e) => {
    console.log(`API: eth refreshed, bal: ${e.dealerBal}`)
    e.dealerBal = parseInt(e.dealerBal)
    res.json(e)
  }).catch(err('API: eth refresh'))
})

router.get('/cashout', (req, res, next) => {
  console.log(`API: cashing out ${req.state.public.chips} chips`)
  res.json(Object.assign({}, req.state, {
    tx: '0xtxid0123',
    chips: 0,
  }))
})


//////////////////////////////
// Generic function to handle each move

const handleMove = (req, res, move) => {

  if (!req.id) { err('API: no req.id') }
  if (!req.state) { err('API: no req.state') }

  console.log(`API: Handling ${move} for id ${req.id.substring(0,8)}`)

  // insert this move into our log of all actions taken
  db.actions.insert({
    cookie: req.id,
    action: { type: move }
  }).then(() => {
    console.log(`API: inserted ${move} into db.actions`)
  }).catch(err('API: actions.insert'))

  const newState = bj(req.state, { type: move })

  // insert the result of this move into our states collection
  db.states.update(
    { cookie: req.id },
    { cookie: req.id, state: newState }
  ).then(() => {
    console.log(`API: updated db.states for ${req.id.substring(0,8)}`)
    // send the user the public part of our game state
    res.json(newState.public)
  }).catch(err('API: states.update'))

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
