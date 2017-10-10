
const double = (state) => {
  // don't do anything if deal isn't currently a valid move
  if (!state.moves.includes('double')) { return (state) }

  const deck = state.deck.slice()
  const chips = state.chips -
    state.playerHands.find(h => h.isActive).bet

  const playerHands = state.playerHands.map(h => (
    h.isActive ?
      Object.assign({}, h, {
        bet: h.bet * 2,
        cards: h.cards.concat(deck.pop()),
        isDone: true,
        isActive: false,
      }) :
      Object.assign({}, h)
  ))

  return (Object.assign({}, state, { deck, playerHands, chips }))
}

export default double;
