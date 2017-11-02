import payout from './payout'

const deal = (state, deck) => {
  // don't do anything if this isn't currently a valid move
  if (!state.public.moves.includes('deal')) { return (state) }

  // ns for New State
  const ns = {
    public: {
      message: 'Make your move...',
      moves: [], // NOTE: payout() will set allowed moves
      playerHands: [{
        isActive: true,
        isDone: false,
        bet: state.public.bet,
        cards: [],
      }],
      dealerCards: [],
      chips: Number(state.public.chips),
      bet: Number(state.public.bet),
    },
    private: {
      deck: deck.slice(),
      hiddenCard: {},
    },
  }

  // deal 2 cards to the player
  ns.public.playerHands[0].cards.push(ns.private.deck.pop())
  ns.public.playerHands[0].cards.push(ns.private.deck.pop())

  // publicly give the dealer a placeholder and a face-up card
  ns.public.dealerCards.push({ rank: '?', suit: '?' })
  ns.public.dealerCards.push(ns.private.deck.pop())

  // privately, give the dealer one real card
  ns.private.hiddenCard = ns.private.deck.pop()

  // move some of our player's chips to this round's betting pool
  ns.public.chips -= ns.public.bet

  return (payout(Object.assign({}, state, ns)))
}

export default deal;
