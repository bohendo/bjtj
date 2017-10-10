
const deal = (state, deck) => {
  // don't do anything if this isn't currently a valid move
  if (!state.moves.includes('deal')) { return (state) }

  const dealerCards = []
  const playerHands = [{
    isActive: true,
    isDone: false,
    cards: [],
  }]

  // deal 4 cards
  dealerCards.push(deck.pop());
  playerHands[0].cards.push(deck.pop());
  dealerCards.push(deck.pop());
  playerHands[0].cards.push(deck.pop());

  // initialize flags for player's hand
  playerHands[0].isActive = true
  playerHands[0].isDone = false
  playerHands[0].bet = state.defaultBet

  // move player's chips to this hand's bet
  const chips = state.chips - state.defaultBet

  return (Object.assign({}, state, {
    playerHands, dealerCards, chips,
  }))
}

export default deal;
