
import React from 'react'
import { hydrate } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'

import blackjack from './reducers'
import Index from './components/index'
import logger from './middleware/logger'

import theme from './style.scss'

const preloadedState = window.__PRELOADED_STATE__

delete window.__PRELOADED_STATE__

const store = createStore(blackjack, preloadedState, applyMiddleware(logger))

hydrate(
  <Provider store={store}>
    <Index />
  </Provider>,
  document.getElementById('root'),
)

