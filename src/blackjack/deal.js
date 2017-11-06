import { payout } from './payout'

const deal = (state, deck) => {
  // don't do anything if this isn't currently a valid move
  if (!state.public.moves.includes('deal')) { return (state) }

  // create a deep copy of our state (ns for New State)
  const ns = JSON.parse(JSON.stringify(state))

  // copy our new deck into our new state
  ns.private.deck = deck.slice()

  // Initialize an empty hand for the player
  ns.public.playerHands = [{
    isActive: true,
    isDone: false,
    bet: ns.public.bet,
    cards: [],
  }]

  // Initialize an empty hand for the dealer (first public card will be hidden)
  ns.public.dealerCards = [{ rank: '?', suit: '?' }]
  ns.private.hiddenCard = {}

  // deal 2 cards to the player
  ns.public.playerHands[0].cards.push(ns.private.deck.pop())
  ns.public.playerHands[0].cards.push(ns.private.deck.pop())

  // publicly give the dealer a placeholder and a face-up card
  ns.public.dealerCards.push(ns.private.deck.pop())

  // privately, give the dealer one real card
  ns.private.hiddenCard = ns.private.deck.pop()

  // move some of our player's chips to this round's betting pool
  ns.public.chips -= ns.public.bet

  return (payout(ns))
}

export { deal }
