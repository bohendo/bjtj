import fetch from 'isomorphic-fetch'

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
    dispatch({ type: SUBMIT })

    return fetch(`/api/${move.toLowerCase()}`, { credentials: 'same-origin' }).then((response) => {
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
  return ({
    type: FAILURE,
    error: `I messed up and caused a ${error.name} :(`,
  })
}
