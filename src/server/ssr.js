
import path from 'path'

import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'

import Index from '../components/index'
import reducer from '../reducers'
import db from './mongo'
import { err } from '../utils'

import template from '../index.html'


const serverSideRender = (req, res) =>{

  if (!req.id) { err('SSR: no req.id') }
  if (!req.state) { err('SSR: no req.state') }

  // Only send the client the public part of our game state
  const store = createStore(reducer, req.state.public)

  const html = renderToString(
    <Provider store={store}>
      <Index />
    </Provider>,
  )

  const state = store.getState()

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
    window.__BJVM_STATE__ = ${JSON.stringify(state)}
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

  console.log(`SSR: successful render for ${req.id.substring(0,8)}`)
  res.send(index)
}

export default serverSideRender
