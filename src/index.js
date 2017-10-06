
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import blackjack from './reducers'
import Page from './components/page'

import theme from './style.scss'

let store = createStore(blackjack)

render(
  <Provider store={store}>
    <Page />
  </Provider>,
  document.getElementById('root'),
)

