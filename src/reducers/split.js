import payout from './payout'

const split = (state) => {
  // don't do anything if deal isn't currently a valid move
  if (!state.public.moves.includes('split')) { return (state) }

  const ns = {
    public: {
      playerHands: state.public.playerHands.slice(),
      bet: Number(state.public.bet),
      chips: Number(state.public.chips - state.public.bet),
    },
    private: {
      deck: state.private.deck.slice(),
    },
  }

  // get the hand we're going to split
  const hand = ns.public.playerHands.find(h => h.isActive)

  // remove the hand-to-split
  ns.public.playerHands = ns.public.playerHands.filter(h => !h.isActive)

  // split the hand we removed into two
  ns.public.playerHands.push({
    isActive: true,
    isDone: false,
    bet: ns.public.bet,
    cards: [hand.cards[0], ns.private.deck.pop()],
  })
  ns.public.playerHands.push({
    isActive: false,
    isDone: false,
    bet: ns.public.bet,
    cards: [hand.cards[1], ns.private.deck.pop()],
  })

  return (payout(Object.assign({}, state, ns)))
}

export default split
