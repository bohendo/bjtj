import fetch from 'isomorphic-fetch'
import { 
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

  // not used yet but might be later
  waiting: false,

  // let's disclose our server's financial situation
  dealerAddr: '0xabc123...',
  dealerBal: 0,

  // placeholder
  playerAddr: 'LOCKED',
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
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
