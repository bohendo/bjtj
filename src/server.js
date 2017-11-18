import 'babel-polyfill'

// My express middleware
import auth from './server/auth'
import api  from './server/api'
import ssr  from './server/ssr'
import { err }  from './utils'

////////////////////////////////////////
// START express pipeline
const app = require('express')()

// 3rd party express middleware
app.use(require('helmet')())
app.use(require('universal-cookie-express')())

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
app.use((err, req, res, next) => {
  res.status(500).send('Something broke!')
  console.error(err)
  process.exit(1)
})

// start http server
app.listen(3000, () => {
  console.log('Listening on port 3000')
})

