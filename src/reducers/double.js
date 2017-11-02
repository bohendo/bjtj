import payout from './payout'

const double = (state) => {
  // don't do anything if deal isn't currently a valid move
  if (!state.public.moves.includes('double')) { return (state) }

  const ns = {
    public: {
      playerHands: state.public.playerHands.slice(),
      bet: Number(state.public.chips),
      chips: Number(state.public.chips - state.public.bet),
    },
    private: {
      deck: state.private.deck.slice(),
    },
  }

  ns.public.playerHands = ns.public.playerHands.map(h => (
    h.isActive ?
      Object.assign({}, h, {
        bet: ns.public.bet * 2,
        cards: h.cards.concat(ns.private.deck.pop()),
        isDone: true,
        isActive: false,
      }) :
      Object.assign({}, h)
  ))

  return (payout(Object.assign({}, state, ns)))
}

export default double;
