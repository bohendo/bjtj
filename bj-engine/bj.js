
import { createStore } from 'redux'

// TODO: Use crypto for better random number generation
// const crypto = require('crypto');

////////////////////////////////////////
// Reducers

const shuffle = (state) => {
  const ranks = ['A', '2', '3', '4', '5', '6', '7',
                 '8', '9', 'T', 'J', 'Q', 'K'];
  const suits = ['C', 'D', 'H', 'S'];
  let deck = [];
  for (let r=0; r<ranks.length; r++) {
    for (let s=0; s<suits.length; s++) {
      deck.push({rank: ranks[r], suit: suits[s]})
    }
  }
  for (let i=deck.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [deck[i-1], deck[j]] = [deck[j], deck[i-1]];
  }
  // assign state & deck to empty object (new state)
  return Object.assign({}, state, { deck, dealerHand: [], playerHand: [] });
}


const deal = (state) => {
  const newState = Object.assign({}, state);

  // Deal 4 cards to the dealer and player
  newState.dealerHand.push(newState.deck.pop());
  newState.playerHand.push(newState.deck.pop());
  newState.dealerHand.push(newState.deck.pop());
  newState.playerHand.push(newState.deck.pop());

  return(newState);
}

////////////////////////////////////////
// Master Reducer

const BJapp = (state = {}, action) => {
  switch (action.type) {
    case 'SHUFFLE':
      return shuffle(state);
    case 'DEAL':
      return deal(state);
    default:
      return state;
  }
}


const initialState = {
  deck: shuffle(),
  playerHand: [],
  dealerHand: [],
  bet: 0
}

let store = createStore(BJapp, initialState);

// print every state change
let unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

store.dispatch({ type: 'SHUFFLE' });
store.dispatch({ type: 'DEAL' });
store.dispatch({ type: 'SHUFFLE' });


