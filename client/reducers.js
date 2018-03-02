import fetch from 'isomorphic-fetch'
import { 
  MESSAGE,
  AUTH,
  AUTOGRAPH,
  SUBMIT,
  CASHOUT,
  REFRESH,
  SUCCESS,
  FAILURE,
} from './actions'

/* This is the client-side reducer, it doesn't contain any blackjack logic.
 * Instead, it asyncronously asks the server to update our state for us.
 * (This bj state only contains the public half of the backend bj state)
 */

const initialState = {
  message: 'Log into MetaMask to play',
  moves: [],
  playerHands: [],
  dealerCards: [],
  bet: 1,
  chips: 5,
  waiting: false,
  authenticated: false
}

const reducer = (state = initialState, action) => {
  console.log(`Reducer: reducing ${JSON.stringify(action)} & state ${JSON.stringify(state)}`)
  switch (action.type) {
    case AUTH:
      return (Object.assign({}, state,
        { authenticated: action.res }
      ))
    case MESSAGE:
      return (Object.assign({}, state,
        { message: action.message }
      ))
    case AUTOGRAPH:
      return (Object.assign({}, state,
        { waiting: true, authenticated: action.authenticated }
      ))
    case CASHOUT:
      return (Object.assign({}, state,
        { waiting: true }
      ))
    case REFRESH:
      return (Object.assign({}, state,
        { waiting: true },
      ))
     case SUBMIT:
      return (Object.assign({}, state,
        { waiting: true },
      ))
    case SUCCESS:
      return (Object.assign({}, state,
        action.state,
        { waiting: false },
      ))
    case FAILURE:
      return (Object.assign({}, state,
        { message: action.error },
        { waiting: false },
      ))
    default:
      return state
  }
}

export default reducer;
