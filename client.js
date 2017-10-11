
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'

import blackjack from './src/reducers'
import Page from './src/components/page'
import logger from './src/middleware/logger'

import theme from './src/style.scss'

const preloadedState = window.__PRELOADED_STATE__

delete window.__PRELOADED_STATE__

const store = createStore(blackjack, preloadedState, applyMiddleware(logger))

render(
  <Provider store={store}>
    <Page />
  </Provider>,
  document.getElementById('root'),
)

