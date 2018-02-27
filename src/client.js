
import 'babel-polyfill'

import React from 'react'
import { hydrate } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMW from 'redux-thunk'

import reducer from './reducers'
import Container from './containers/index'

import theme from './style.css'

import Web3 from 'web3'

// clobber global web3 if it exists
window.web3 = new Web3(Web3.givenProvider || "http://localhost:7545")

const state = window.__BJVM_STATE__
delete window.__BJVM_STATE__

const store = createStore(reducer, state, applyMiddleware(thunkMW))

hydrate(
  <Provider store={store}>
    <Container />
  </Provider>,
  document.getElementById('bjvm_root'),
)

