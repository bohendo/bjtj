
import payout from './payout'

const split = (state) => {
  // don't do anything if deal isn't currently a valid move
  if (!state.moves.includes('split')) { return (state) }

  const chips = state.chips -
    state.playerHands.find(h => h.isActive).bet

  const deck = state.deck.slice()

  const playerHands = state.playerHands.filter(h => !h.isActive)

  const hand = state.playerHands.find(h => h.isActive)

  // add two new hands
  playerHands.push({
    isActive: true,
    isDone: false,
    bet: hand.bet,
    cards: [hand.cards[0], deck.pop()],
  })
  playerHands.push({
    isActive: false,
    isDone: false,
    bet: hand.bet,
    cards: [hand.cards[1], deck.pop()],
  })

  return (payout(Object.assign({}, state, { deck, chips, playerHands })))
}

export default split
