
// Node built-ins
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

import express from 'express'

// 3rd party express middleware
import helmet from 'helmet'
import cookieMW from 'universal-cookie-express'

// My express middleware
import ssr from './server/ssr'
import api from './server/api'

const production = process.env.NODE_ENV === 'production'

//////////////////////////////
// Express Pipeline

const app = express()

app.use(helmet())

app.use(cookieMW())

app.use('/static', express.static(
  path.join(__dirname, './build/public'),
))

// ssr for Server-side rendering
app.get('/', ssr)
app.use('/api', api)

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
  console.log('some test')
})

