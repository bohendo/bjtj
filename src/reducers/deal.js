
const deal = (state, deck) => {
  // don't do anything if this isn't currently a valid move
  if (!state.moves.includes('deal')) { return (state) }

  const dealerCards = []
  const playerHands = [{
    isActive: true,
    isDone: false,
    bet: state.defaultBet,
    cards: [],
  }]

  // deal 4 cards
  dealerCards.push(deck.pop());
  playerHands[0].cards.push(deck.pop());
  dealerCards.push(deck.pop());
  playerHands[0].cards.push(deck.pop());

  // move player's chips to this hand's bet
  const chips = state.chips - state.defaultBet

  const message = 'Make your move..'

  return (Object.assign({}, state, {
    playerHands, dealerCards, chips, message,
  }))
}

export default deal;
