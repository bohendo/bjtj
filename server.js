
import path from 'path'
import fs from 'fs'

import express from 'express'

import cookiesMW from 'universal-cookie-express'

import helmet from 'helmet'

const crypto = require('crypto')

import ssr from './src/server/ssr'

const production = process.env.NODE_ENV === 'production'

//////////////////////////////
// Express Pipeline

const app = express()

app.use(helmet())

app.use('/static', express.static(
  path.join(__dirname, './build/public'),
))

app.use(cookiesMW())

app.get('/api/newuser', (req, res, next) => {

  const hash = crypto.createHash('sha256');

  hash.update(req.headers['user-agent'].toString())
  hash.update(Date.now().toString())

  console.log(hash.digest('hex'))

  res.send('new user remembered!')

})

// ssr for Server-side rendering
app.get('/', ssr)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// error handler goes at the end of our pipe
app.use((req, res) => {
  res.status(404).send(`
  This page doesn't exist..
  Well THIS one does but whichever one you were looking for doesn't
  unless you were looking for this one in which case here it is :)
  `)
})


//////////////////////////////
// start http server

app.listen(3000, () => {
  console.log('Listening on port 3000')
})
