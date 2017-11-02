import payout from './payout'

const stand = (state) => {
  // don't do anything if this isn't currently a valid move
  if (!state.public.moves.includes('stand')) { return (state) }

  const ns = {
    public: {
      playerHands: state.public.playerHands.slice(),
    },
  }

  ns.public.playerHands = ns.public.playerHands.map(h => (
    h.isActive ?
      Object.assign({}, h, { isDone: true }) :
      Object.assign({}, h)
  ))

  return (payout(Object.assign({}, state, ns)))
}

export default stand
