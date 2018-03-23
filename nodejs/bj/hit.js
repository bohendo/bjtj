import { sync } from './sync'

const hit = (state) => {
  // don't do anything if this isn't currently a valid move
  if (!state.public.moves.includes('hit')) { return (state) }

  // create a deep copy of our state (ns for New State)
  const ns = JSON.parse(JSON.stringify(state))

  // Add a card to the active hand
  ns.public.playerHands = ns.public.playerHands.map(h => (
    h.isActive ?
      Object.assign({}, h, {
        cards: h.cards.concat(ns.private.deck.pop()),
      }) :
      Object.assign({}, h)
  ))

  return (sync(ns))
}

export { hit }
