import 'babel-polyfill'
import React from 'react'
import Web3 from 'web3'
import { hydrate } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMW from 'redux-thunk'

import theme from './style.css'
import reducer from './reducers'
import Container from './containers'

window.web3 = new Web3(Web3.givenProvider)

hydrate(
  <Provider store={createStore(reducer, undefined, applyMiddleware(thunkMW))}>
    <Container />
  </Provider>,
  document.getElementById('bjvm_root'),
)

