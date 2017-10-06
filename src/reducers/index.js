
import { createStore } from 'redux'

// TODO: Use crypto for better random number generation
// const crypto = require('crypto');

////////////////////////////////////////
// Helpers

const shuffle = () => {
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
  return(deck)
}

////////////////////////////////////////
// Reducers

const deal = (state) => {
  const newState = {
    dealerHand: [],
    playerHand: [],
    deck: shuffle()
  }

  // Deal 4 cards to the dealer and player
  newState.dealerHand.push(newState.deck.pop());
  newState.playerHand.push(newState.deck.pop());
  newState.dealerHand.push(newState.deck.pop());
  newState.playerHand.push(newState.deck.pop());

  return(Object.assign({}, state, newState));
}

const initialState = {
  deck: shuffle(),
  playerHand: [],
  dealerHand: [],
  bet: 0
}

////////////////////////////////////////
// Master Reducer

const blackjack = (state = initialState, action) => {
  switch (action.type) {
    case 'SHUFFLE':
      return shuffle(state);
    case 'DEAL':
      return deal(state);
    case 'HIT':
      return state;
    case 'STAND':
      return state;
    case 'DOUBLE':
      return state;
    case 'SPLIT':
      return state;
    default:
      return state;
  }
}

export default blackjack;
