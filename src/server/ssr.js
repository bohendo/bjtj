
import path from 'path'

import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'

import Index from '../components/index'
import reducer from '../reducers'
import db from './mongo'
import { err } from '../utils'
import eth from './eth'

import template from '../index.html'


const serverSideRender = (req, res) =>{

  if (!req.id) { err('SSR: no req.id') }
  if (!req.state) { err('SSR: no req.state') }

  // wait for eth calls to return before server-side rendering
  eth.dealerData().then((e) => {

    // Only send the client the public part of our game state
    const store = createStore(reducer, Object.assign(req.state.public, e))

    const html = renderToString(
      <Provider store={store}>
        <Index />
      </Provider>,
    )

    // inject stylesheet
    let index = template.replace(
      /<\/head>/,
      '  <link href="/static/style.css" rel="stylesheet">\n$&',
    ).replace(
      /<\/body>/,
      `  <script>
      window.__BJVM_STATE__ = ${JSON.stringify(store.getState())}
    </script>\n$&`,
    ).replace(
      /<\/body>/,
      '  <script src="/static/client.bundle.js"></script>\n$&',
    ).replace(
      /<div id="root">/,
      `$&${html}`,
    )

    console.log(`SSR: successful render for ${req.id.substring(0,8)}`)

    res.send(index)
  })
}

export default serverSideRender
