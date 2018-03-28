import fetch from 'isomorphic-fetch'
import sigUtil from 'eth-sig-util'

import { agreement, signData, verify } from './verify'

// Synchronous actions & action creators
export const MESSAGE = 'MESSAGE'
export function message(msg) {
  return ({ type: MESSAGE, message: msg})
}

export const AUTH = 'AUTH'
export function auth(res) {
  return ({ type: AUTH, res: res })
}

// ASYNC actions & action creators

export const SUBMIT = 'SUBMIT'
export function submit(move) {
  console.log(`Sending request to server: ${move}`)
  return function(dispatch) { // utilizes redux-thunk

    const cookies = document.cookie;
    const bjtj_id = cookies.match(/bjtj_id=(0x[0-9a-f]+)/)
    const bjtj_ag = cookies.match(/bjtj_ag=(0x[0-9a-f]+)/)

    if (!bjtj_id || !bjtj_ag || !verify(bjtj_id[1], bjtj_ag[1])) {
      return dispatch(failure('The dealer needs an autograph first'))
    }

    dispatch({ type: SUBMIT })
    const query = `move=${move.toLowerCase()}&id=${bjtj_id[1]}&ag=${bjtj_ag[1]}`
    return fetch(`/wp-json/bjtj/v1/move?${query}`).then((response) => {
      return response.json().then(state=>{

        dispatch(success(state))

      }).catch((error) => dispatch(failure(error)))
    }).catch((error) => dispatch(failure(error)))

  }
}

export const SUCCESS = 'SUCCESS'
export function success(state) {
  console.log(`Success, server response : ${JSON.stringify(state)}`)
  return ({
    type: SUCCESS,
    state,
  })
}

export const FAILURE = 'FAILURE'
export function failure(error) {
  console.log(`Failed to receive server response: ${error}`)
  const err = error.name ? `I messed up and caused a ${error.name} :(` : error
  return ({
    type: FAILURE,
    error: err
  })
}
