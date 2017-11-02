import payout from './payout'

const hit = (state) => {
  // don't do anything if this isn't currently a valid move
  if (!state.public.moves.includes('hit')) { return (state) }

  const ns = {
    public: {
      playerHands: state.public.playerHands.slice(),
    },
    private: {
      deck: state.private.deck.slice(),
    },
  }

  // Assumes there will only be one active hand
  ns.public.playerHands = ns.public.playerHands.map(h => (
    h.isActive ?
      Object.assign({}, h, {
        cards: h.cards.concat(ns.private.deck.pop()),
      }) :
      Object.assign({}, h)
  ))

  return (payout(Object.assign({}, state, ns)))
}

export default hit
