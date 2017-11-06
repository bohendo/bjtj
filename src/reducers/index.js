
import fetch from 'isomorphic-fetch'
import { 
  SELECT,
  SUBMIT,
  REFRESH,
  SUCCESS,
  FAILURE,
} from '../actions'

/* This is the client-side reducer. It doesn't contain any blackjack
 * logic, instead it asyncronously asks the server to update our state
 */

// NOTE: The frontend state is the public half of the backend state
const initialState = {
  message: 'Click Deal when you\'re ready to play!',
  moves: ['deal'],
  playerHands: [],
  dealerCards: [],
  bet: 1,
  chips: 5,
  waiting: false,
}

const reducer = (state = initialState, action) => {

  switch (action.type) {
    case SUBMIT:
      return (Object.assign({}, state, {
        waiting: true
      }))
    case SUCCESS:
      return Object.assign({}, action.state, {
        waiting: false
      })
    case FAILURE:
      return (Object.assign({}, state, {
        message: action.error,
      }))
    default:
      return state
  }

}

export default reducer;
