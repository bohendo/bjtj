import fetch from 'isomorphic-fetch'
import { 
  MESSAGE,
  AUTH,
  SUBMIT,
  SUCCESS,
  FAILURE,
} from './actions'

/* This is the client-side reducer, it doesn't contain any blackjack logic.
 * Instead, it asyncronously asks the server to update our state for us.
 * (This bj state only contains the public half of the backend bj state)
 */

const initialState = {
  message: 'Hmm, trying to remember if I know you..',
  moves: ['refresh'],
  playerHands: [],
  dealerCards: [],
  bet: 0,
  chips: 0,

  contract_address: '0x???',
  dealer_address: '0x???',
  dealer_balance: '0',

  waiting: false,
  authed: false
}

const reducer = (state = initialState, action) => {
  //console.log(`Reducer: reducing ${JSON.stringify(action)} & state ${JSON.stringify(state)}`)
  switch (action.type) {
    case MESSAGE:
      return (Object.assign({}, state,
        { message: action.message }
      ))
    case AUTH:
      return (Object.assign({}, state,
        { authed: action.res }
      ))
    case SUBMIT:
      return (Object.assign({}, state, {
        message: 'Waiting for the dealer to respond..',
        waiting: true
      }))
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
