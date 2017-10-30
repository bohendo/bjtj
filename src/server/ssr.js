
import path from 'path'

import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'

import Index from '../components/index'
import blackjack from '../reducers'
import db from './mongo'

import template from '../index.html'


const serverSideRender = (req, res) =>{

  const id = req.universalCookies.get('id')

  if (!id) {
    res.send(renderIndex(createStore(blackjack)))
  }

  db.states.findOne({ cookie: id }).then((doc) => {
    if (doc.state) {
      res.send(renderIndex(createStore(blackjack, doc.state)))
    } else {
      res.send(renderIndex(createStore(blackjack)))
    }
  }).catch((e) => { console.error(e) })

}


const renderIndex = store => {

  const html = renderToString(
    <Provider store={store}>
      <Index />
    </Provider>,
  )

  const finalState = store.getState()

  // load my index.html template
  let index = template

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

  return (index)
}

export default serverSideRender
