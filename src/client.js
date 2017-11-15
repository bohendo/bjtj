
import 'babel-polyfill'

import React from 'react'
import { hydrate } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMW from 'redux-thunk'

import reducer from './reducers'
import Index from './components/index'

import theme from './style.scss'

import Web3 from 'web3'
var web3 = new Web3(Web3.givenProvider || "ws://localhost:8546")

const state = window.__BJVM_STATE__
delete window.__BJVM_STATE__

const store = createStore(reducer, state, applyMiddleware(thunkMW))

hydrate(
  <Provider store={store}>
    <Index />
  </Provider>,
  document.getElementById('root'),
)

