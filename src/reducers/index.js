
import { createStore } from 'redux'
import assert from 'assert'

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

const getVal = (hand) => {

  // check for a blackjack first: has to happen in first 2 cards
  if (hand.length === 2 &&
      // does this hand include an ace?
      hand.map(c=>c.rank).includes('A') &&
      // is some ten-val rank included in our hand's card ranks?
      ['T', 'J', 'Q', 'K'].some(c=>hand.map(c=>c.rank).includes(c))) {
    return({ isSoft: false, bj: true, n: 21 })
  }

  let val = { isSoft: false, bj: false, n: 0 };

  for (let ci=0; ci<hand.length; ci++) {

    // Aces are special, handle them separately
    if (hand[ci].rank === 'A') {
      if (val.n > 11) {
        val.n = val.n + 1;
      } else {
        val.isSoft = true
        val.n = val.n + 11
      }
      
    } else if (['T', 'J', 'Q', 'K'].includes(hand[ci].rank)) {
      val.n = val.n + 10;
    } else {
      val.n = val.n + Number(hand[ci].rank)
    }
    
    // After adding our last card, do we need to unsoften?
    if (val.n > 21 && val.isSoft) {
      let n = val.n-10
      val = { isSoft: false, bj: false, n: n }
    }
  }
  return(val)
}

// Test suite
assert.equal(21, getVal([{rank:'A'},{rank:'K'}]).n)
assert.equal(19, getVal([{rank:'9'},{rank:'K'}]).n)
assert.equal(20, getVal([{rank:'A'},{rank:'9'}]).n)
assert.equal(13, getVal([{rank:'A'},{rank:'9'},{rank:'3'}]).n)
assert.equal(21, getVal([{rank:'K'},{rank:'7'},{rank:'4'}]).n)
assert.equal(24, getVal([{rank:'K'},{rank:'7'},{rank:'7'}]).n)
assert.equal(true, getVal([{rank:'A'},{rank:'K'}]).bj)
assert.equal(false, getVal([{rank:'K'},{rank:'7'},{rank:'4'}]).bj)
assert.equal(false, getVal([{rank:'A'},{rank:'9'}]).bj)
assert.equal(true, getVal([{rank:'A'},{rank:'9'}]).isSoft)
assert.equal(false, getVal([{rank:'A'},{rank:'9'},{rank:'3'}]).isSoft)

const dealerIsDone = (hand) => {
  let v = getVal(hand)
  if (v.n >= 18) return true
  if (v.n === 17 && v.isSoft === false) return true
  return false
}

////////////////////////////////////////
// Reducers

const deal = (state) => {

  // don't do anything if deal isn't currently a valid move
  if (!state.moves.includes('deal')) {
    return(state)
  }

  const ns = {
    dealerHand: [],
    playerHand: [],
    deck: shuffle(),
    bet: state.bet,
    chips: state.chips,
  }

  // Deal 4 cards to the dealer and player
  ns.dealerHand.push(ns.deck.pop());
  ns.playerHand.push(ns.deck.pop());
  ns.dealerHand.push(ns.deck.pop());
  ns.playerHand.push(ns.deck.pop());

  if (getVal(ns.playerHand).bj || getVal(ns.dealerHand).bj) {
    return(payout(Object.assign({}, state, ns)));
  }

  let moves = ['hit', 'stand']

  if (ns.bet*2<=ns.chips) {
    moves.push('double')
  }

  if (ns.playerHand[0].rank === ns.playerHand[1].rank) {
    moves.push('split')
  }

  ns.message = "Make your move..."
  ns.moves = moves
  return(Object.assign({}, state, ns));
}

const hit = (state) => {
  // don't do anything if deal isn't currently a valid move
  if (!state.moves.includes('hit')) {
    return(state)
  }
  const ns = {
    moves: state.moves.slice(),
    deck: state.deck.slice(),
    playerHand: state.playerHand.slice(),
  }
  ns.playerHand.push(ns.deck.pop());

  ns.moves = ['hit', 'stand']

  if (getVal(ns.playerHand).n >= 21) {
    return(payout(Object.assign({}, state, ns)));
  } else {
    ns.message = "Hit again?!"
    return(Object.assign({}, state, ns));
  }

}

const stand = (state) => {
  // don't do anything if deal isn't currently a valid move
  if (!state.moves.includes('stand')) {
    return(state)
  }
    return(payout(state))
}


const payout = (state) => {
  const ns = {
    deck: state.deck.slice(),
    playerHand: state.playerHand.slice(),
    dealerHand: state.dealerHand.slice(),
    baseBet: state.baseBet,
    bet: state.bet,
    chips: state.chips
  }

  // make sure dealer's hand is played out
  while (! dealerIsDone(ns.dealerHand)) {
    ns.dealerHand.push(ns.deck.pop())
  }

  // check player's hand & payout appropriately
  let dv = getVal(ns.dealerHand)
  let pv = getVal(ns.playerHand)
  
  if (pv.bj && ! dv.bj) {
    // player blackjack!
    ns.chips = ns.chips + ns.bet * 1.5
    ns.message = 'Blackjack! Congrats'
  } else if (pv.bj && dv.bj) {
    // tie: no payout or loss
    ns.message = 'Blackjack! But the dealer also blackjacked..'
  } else if (pv.n > 21) {
    // player busted: lose
    ns.chips = ns.chips - ns.bet
    ns.message = 'Bust!'
  } else if (dv.n > 21) {
    // dealer busted: win
    ns.chips = ns.chips + ns.bet
    ns.message = 'Dealer Bust!'
  } else if (pv.n > dv.n) {
    // player had higher score
    ns.chips = ns.chips + ns.bet
    ns.message = 'Well played!'
  } else if (pv.n === dv.n) {
    // tie: no payout or loss
    ns.message = 'Tie...'
  } else if (pv.n < dv.n) {
    // dealer had higher score
    ns.chips = ns.chips - ns.bet
    ns.message = 'Better luck next time'
  }

  if (ns.chips >= ns.bet) {
    ns.moves = ['deal', 'bet']
  } else {
    ns.moves = ['bet']
  }
  ns.bet = ns.baseBet
  return(Object.assign({}, state, ns));
}

const double = (state) => {
  // don't do anything if deal isn't currently a valid move
  if (!state.moves.includes('double')) {
    return(state)
  }
  const ns = {
    deck: state.deck.slice(),
    playerHand: state.playerHand.slice(),
    dealerHand: state.dealerHand.slice(),
    bet: state.bet,
    chips: state.chips
  }

  ns.bet = ns.bet * 2
  ns.playerHand.push(ns.deck.pop())

  return(payout(Object.assign({}, state, ns)))
}

const split = (state) => {
  // don't do anything if deal isn't currently a valid move
  if (!state.moves.includes('split')) {
    return(state)
  }
  const ns = {
    moves: state.moves.slice()
  }
  // haven't implemented split yet..
  ns.moves = ['hit', 'stand', 'double']
  ns.message = 'Split does not work yet, sorry!'
  return(Object.assign({}, state, ns));
}

const initialState = {
  message: 'Click "Deal" when you\'re ready to go',
  moves: ['deal', 'bet'],
  deck: shuffle(),
  playerHand: [],
  dealerHand: [],
  bet: 1,
  baseBet: 1,
  chips: 5
}

////////////////////////////////////////
// Master Reducer

const blackjack = (state = initialState, action) => {
  switch (action.type) {
    case 'DEAL':
      return deal(state);
    case 'HIT':
      return hit(state);
    case 'STAND':
      return stand(state);
    case 'DOUBLE':
      return double(state);
    case 'SPLIT':
      return split(state);
    default:
      return state;
  }
}

export default blackjack;
