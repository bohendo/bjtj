
import payout from './payout'

const hit = (state) => {
  // don't do anything if this isn't currently a valid move
  if (!state.moves.includes('hit')) { return (state) }

  const deck = state.deck.slice()

  const playerHands = state.playerHands.map(h => (
    h.isActive ?
      Object.assign({}, h, { cards: h.cards.concat(deck.pop()) }) :
      Object.assign({}, h)
  ))

  return (payout(Object.assign({}, state, { deck, playerHands })))
}

export default hit
