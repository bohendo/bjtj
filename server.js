
const qs = require('qs')
const path = require('path')
const fs = require('fs')
const express = require('express')

const React = require('react')
const createStore = require('redux')
const Provider = require('react-redux')
const renderToString = require('react-dom/server')

const blackjack = require('./src/reducers')
const Page = require('./src/components/page')

const app = express()
const port = 3000

const read = filename => (
  fs.readFileSync(path.join(__dirname, filename), 'utf8')
)


//////////////////////////////
// setup Mongo connection

/*
const auth = read('data/mongo-auth.secret')
const db = require('monk')(
  // url format: 'mongodb://user:password@host:port/database'
  `mongodb://bohendo:${auth}@127.0.0.1:27017/bohendo`,
  // monk arg2: error callback
  (err) => { if (err) console.error(err); }
);
*/


//////////////////////////////
// Helper Functions

function renderFullPage(html, preloadedState) {
  // load my index.html template
  const index = read('src/index.html')

  // inject my stylesheet
  index.replace(
    /<\/head>/,
    '<link href="/static/style.css" rel="stylesheet">$&',
  )

  // inject preloaded state
  index.replace(
    /<\/body>/,
    `<script>
       window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
     </script>$&`,
  )

  // inject my javascript
  index.replace(
    /<\/body>/,
    '<script src="/static/bjvm.bundle.js"></script>$&',
  )

  // inject rendered html
  index.replace(
    /<div id="root">/,
    `$&${html}`,
  )

  return (index)
}


function handleRender(req, res) {
  const params = qs.parse(req.query)
  const chips = parseInt(params.chips, 10) || 5

  const store = createStore(blackjack)

  const html = renderToString(
    <Provider store={store}>
      <Page />
    </Provider>,
  )

  const finalState = store.getState()

  res.send(renderFullPage(html, finalState))
}


//////////////////////////////
// Express pipeline

const distDir = path.join(__dirname, '/dist');

app.use('/static', express.static(distDir));

app.use('/', handleRender)

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// error handler goes at the end of our pipe
app.use((req, res) => {
  res.status(404).send(`
  This page doesn\'t exist.
  Well THIS one does but whichever one you were looking for doesn\'t
  unless you were looking for this one in which case here it is
  `);
});


//////////////////////////////
// start http server

app.listen(port);
console.log(`Listening on port ${port}`)

