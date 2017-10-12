
import React from 'react'
import { hydrate } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'

import blackjack from './src/reducers'
import Index from './src/components/index'
import logger from './src/middleware/logger'

import theme from './src/style.scss'

const preloadedState = window.__PRELOADED_STATE__

delete window.__PRELOADED_STATE__

const store = createStore(blackjack, preloadedState, applyMiddleware(logger))

hydrate(
  <Provider store={store}>
    <Index />
  </Provider>,
  document.getElementById('root'),
)

