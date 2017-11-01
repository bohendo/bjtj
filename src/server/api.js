
// Node built-in
import crypto from 'crypto'

const router = require('express').Router()

import { err } from '../utils'
import bj from '../reducers'
import db from './mongo'

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
    res.send({ msg: `Recorded your ${move}`})
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
