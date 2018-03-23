import { deal } from './deal'
import { hit } from './hit'
import { stand } from './stand'
import { double } from './double'
import { split } from './split'
import { sync } from './sync'

// () => [cards]
const shuffle = () => {
  const ranks = ['A', '2', '3', '4', '5', '6', '7',
    '8', '9', 'T', 'J', 'Q', 'K'];
  const suits = ['C', 'D', 'H', 'S'];
  const deck = [];
  for (let r=0; r<ranks.length; r++) {
    for (let s=0; s<suits.length; s++) {
      deck.push({ rank: ranks[r], suit: suits[s] })
    }
  }
  for (let i=deck.length; i; i--) {
    const j = Math.floor(Math.random() * i);
    [deck[i-1], deck[j]] = [deck[j], deck[i-1]];
  }
  // assign state & deck to empty object (new state)
  return (deck)
}


const initialState = {
  public: {
    message: `If you tip me, I'll give you 1 chip per mETH :)`,
    moves: ['deal'],
    playerHands: [],
    dealerCards: [],
    bet: 1,
    chips: 3,
  },
  private: {
    deck: shuffle(),
    hiddenCard: {},
  },
}

////////////////////////////////////////
// Master Reducer

const blackjack = (state = initialState,
                   action = { type: 'NOOP' }) => {

  switch (action.type) {
    case 'DEAL':
      return deal(state, shuffle())
    case 'HIT':
      return hit(state)
    case 'STAND':
      return stand(state)
    case 'DOUBLE':
      return double(state)
    case 'SPLIT':
      return split(state)
    case 'SYNC':
      return sync(state)
    default:
      return state
  }
}

export default blackjack
