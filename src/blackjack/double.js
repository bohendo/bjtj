import { payout } from './payout'

const double = (state) => {
  // don't do anything if deal isn't currently a valid move
  if (!state.public.moves.includes('double')) { return (state) }

  // create a deep copy of our state (ns for New State)
  const ns = JSON.parse(JSON.stringify(state))

  // move another bet from the player's chips to the betting pool
  ns.public.chips -= ns.public.bet

  // double the active hand's payout
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

export { double }
