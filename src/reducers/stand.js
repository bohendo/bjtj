
import payout from './payout'

const stand = (state) => {
  // don't do anything if this isn't currently a valid move
  if (!state.moves.includes('stand')) { return (state) }

  const playerHands = state.playerHands.map(h => (
    h.isActive ?
      Object.assign({}, h, { isDone: true }) :
      Object.assign({}, h)
  ))

  return (payout(Object.assign({}, state, { playerHands })))
}

export default stand
