
import assert from 'assert'

// TODO: Use crypto for better random number generation
// const crypto = require('crypto');

// () => [cards]
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

// [cards] => { n, isSoft, bj }
const score = (hand) => {

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
assert.equal(21, score([{rank:'A'},{rank:'K'}]).n)
assert.equal(19, score([{rank:'9'},{rank:'K'}]).n)
assert.equal(20, score([{rank:'A'},{rank:'9'}]).n)
assert.equal(13, score([{rank:'A'},{rank:'9'},{rank:'3'}]).n)
assert.equal(21, score([{rank:'K'},{rank:'7'},{rank:'4'}]).n)
assert.equal(24, score([{rank:'K'},{rank:'7'},{rank:'7'}]).n)
assert.equal(true, score([{rank:'A'},{rank:'K'}]).bj)
assert.equal(false, score([{rank:'K'},{rank:'7'},{rank:'4'}]).bj)
assert.equal(false, score([{rank:'A'},{rank:'9'}]).bj)
assert.equal(true, score([{rank:'A'},{rank:'9'}]).isSoft)
assert.equal(false, score([{rank:'A'},{rank:'9'},{rank:'3'}]).isSoft)

export { shuffle, score }
