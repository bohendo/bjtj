
import fetch from 'isomorphic-fetch'

// server-side actions
export const DEAL = () => {return({ type: 'DEAL' })}
export const HIT = () => {return({ type: 'HIT' })}
export const STAND = () => {return({ type: 'STAND' })}
export const DOUBLE = () => {return({ type: 'DOUBLE' })}
export const SPLIT = () => {return({ type: 'SPLIT' })}

// client-side actions & action creators

export const CASHOUT = 'CASHOUT'
export function cashout(addr) {
  console.log('Cashout: activated!')
  return function(dispatch) {
    return fetch(`/api/cashout?addr=${addr}`, { credentials: 'same-origin' })
      .then(
        response => response.json(),
        error => dispatch(failure(error))
      ).then(
        data => {
          console.log(`Cashout success: receipt = ${JSON.stringify(data)}`)
          return dispatch(success({ chips: 0 }))
        }
      )
  }
}

export const REFRESH = 'REFRESH'
export function refresh() {
  console.log('Refreshment: activated!')
  return function(dispatch) {
    return fetch('/api/refresh', { credentials: 'same-origin' })
      .then(
        response => response.json(),
        error => dispatch(failure(error))
      ).then(
        ethData => {
          console.log('Refreshment: succeeded!')
          return dispatch(success(ethData))
        }
      )
  }
}

export const SUBMIT = 'SUBMIT'
export function submit(move) {
  console.log(`Submitting move: ${move}`)
  // utilizes redux-thunk
  return function(dispatch) {
    return fetch(`/api/${move.toLowerCase()}`, { credentials: 'same-origin' })
      .then(
        response => response.json(),
        error => dispatch(failure(error))
      ).then(
        state => dispatch(success(state))
      )
  }
}

export const SUCCESS = 'SUCCESS'
export function success(state) {
  return ({
    type: SUCCESS,
    state,
  })
}

export const FAILURE = 'FAILURE'
export function failure(error) {
  return ({
    type: FAILURE,
    error,
  })
}

