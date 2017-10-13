
import fs from 'fs'
import path from 'path'

import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'

import Index from '../components/index'
import blackjack from '../reducers'
import db from './mongo'


const serverSideRender = (req, res) =>{

  const id = req.universalCookies.get('id')
  console.log(id)

  if (!id) {
    res.send(renderIndex(createStore(blackjack)))
  }

  db.states.find({ cookie: id }).then((doc) => {
    doc = doc[0]
    console.log('found:', doc)
    if (doc.state) {
      console.log('Rendering old state')
      res.send(renderIndex(createStore(blackjack, doc.state)))
    } else {
      console.log('Rendering new state')
      res.send(renderIndex(createStore(blackjack)))
    }
  }).catch((e) => { console.error(e) })

}


const renderIndex = store => {

  console.log('rendering index..')

  const html = renderToString(
    <Provider store={store}>
      <Index />
    </Provider>,
  )

  const finalState = store.getState()

  // load my index.html template
  let index = fs.readFileSync('src/index.html', 'utf8')

  // inject my stylesheet
  index = index.replace(
    /<\/head>/,
    '  <link href="/static/style.css" rel="stylesheet">\n$&',
  )

  // inject preloaded state
  index = index.replace(
    /<\/body>/,
    `  <script>
    window.__PRELOADED_STATE__ = ${JSON.stringify(finalState)}
  </script>\n$&`,
  )

  // inject my javascript
  index = index.replace(
    /<\/body>/,
    '  <script src="/static/client.bundle.js"></script>\n$&',
  )

  // inject rendered html
  index = index.replace(
    /<div id="root">/,
    `$&${html}`,
  )

  console.log('onwards')

  return (index)
}

export default serverSideRender
