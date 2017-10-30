
import fs from 'fs'
import express from 'express'

// 3rd party express middleware
import helmet from 'helmet'
import cookieMW from 'universal-cookie-express'

// My express middleware
import api from './server/api'
import ssr from './server/ssr'

// START express pipeline
const app = express()

// good security-minded defaults
app.use(helmet())

// cookie parser
app.use(cookieMW())

// vending machine buttons
app.use('/api', api)

// ssr for server side rendering
app.get('/', ssr)

// catch-all
app.use((req, res) => {
  res.status(404).send(`
  This page doesn't exist..
  Well THIS one does but whichever one you were looking for doesn't
  unless you were looking for this one in which case here it is :)
  `)
})
// END express pipeline

// express pipeline error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// start http server
app.listen(3000, () => {
  console.log('Listening on port 3000')
})

