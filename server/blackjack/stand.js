import { payout } from './payout'

const stand = (state) => {
  // don't do anything if this isn't currently a valid move
  if (!state.public.moves.includes('stand')) { return (state) }

  // create a deep copy of our state (ns for New State)
  const ns = JSON.parse(JSON.stringify(state))

  ns.public.playerHands = ns.public.playerHands.map(h => (
    h.isActive ?
      Object.assign({}, h, { isDone: true }) :
      Object.assign({}, h)
  ))

  return (payout(ns))
}

export { stand }
