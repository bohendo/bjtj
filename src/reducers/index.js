
import { shuffle } from './utils'
import deal from './deal'
import hit from './hit'
import stand from './stand'
import double from './double'
import split from './split'

const initialState = {
  public: {
    message: 'Click "Deal" when you\'re ready to go',
    moves: ['deal'],
    playerHands: [],
    defaultBet: Number(1),
    chips: Number(5),
    dealerCards: [],
  },
  private: {
    deck: shuffle(),
    dealerHiddenCard: [],
  }
}

////////////////////////////////////////
// Master Reducer

const blackjack = (state  = initialState,
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
    default:
      return state
  }

}

export default blackjack;
