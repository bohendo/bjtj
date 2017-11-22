import 'babel-polyfill'

// My express middleware
import api  from './server/api'
import auth from './server/auth'
import eth from './server/eth'
import ssr  from './server/ssr'
import err from './utils/err'

console.log(process.env)

////////////////////////////////////////
// START express pipeline
const app = require('express')()

// 3rd party express middleware
app.use(require('helmet')())
app.use(require('universal-cookie-express')())
app.use(require('body-parser').text())

// initialize id or check for id in db
app.use(auth)

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
////////////////////////////////////////

// express pipeline error handler
app.use((error, req, res, next) => {
  res.status(500).send('Something broke!')
  err(error)
})

// start http server
app.listen(3000, () => {
  console.log('Listening on port 3000')
})

