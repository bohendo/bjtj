
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'

import Index from '../components/index'
import reducer from '../reducers'
import eth from './eth'
import err from '../utils/err'

import template from '../index.html'

const serverSideRender = (req, res) =>{

  // wait for eth calls to return before server-side rendering
  eth.dealerData().then((e) => {

    // Only send the client the public part of our game state
    const store = createStore(reducer, Object.assign(req.state.public, e))

    const html = renderToString(
      <Provider store={store}>
        <Index />
      </Provider>,
    )

    // send index w injected stylesheet, js, etc
    res.send(template.replace(
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
    ))
  }).catch(err)
}

export default serverSideRender
