
import { shuffle } from './utils'
import sync from './sync'
import deal from './deal'
import hit from './hit'
import stand from './stand'
import double from './double'
import split from './split'

const initialState = {
  message: 'Click "Deal" when you\'re ready to go',
  moves: ['deal'],
  playerHands: [],
  dealerCards: [],
  deck: shuffle(),
  defaultBet: Number(1),
  chips: Number(5),
}

////////////////////////////////////////
// Master Reducer

const blackjack = (state = initialState, action) => {
  switch (action.type) {
    case 'DEAL':
      return sync(deal(state, shuffle()))
    case 'HIT':
      return sync(hit(state))
    case 'STAND':
      return sync(stand(state))
    case 'DOUBLE':
      return sync(double(state))
    case 'SPLIT':
      return sync(split(state))
    default:
      return sync(state)
  }
}

export default blackjack;
