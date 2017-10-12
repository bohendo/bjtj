
import fs from 'fs'
import path from 'path'

import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'

import blackjack from '../reducers'
import Index from '../components/index'


const renderFullPage = (html, preloadedState) => {

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
    window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
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

const handleRender = (req, res) =>{
  const store = createStore(blackjack)

  const html = renderToString(
    <Provider store={store}>
      <Index />
    </Provider>,
  )

  const finalState = store.getState()

  res.send(renderFullPage(html, finalState))
}

export default handleRender
