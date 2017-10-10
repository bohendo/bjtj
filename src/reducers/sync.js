
import assert from 'assert'
import { score } from './utils'

const sync = (state) => {
  const playerHands = state.playerHands.map((h) => {
    // if not done but over 20 then we actually are done
    if (!h.isDone && score(h.cards).n >= 21) {
      return (Object.assign({}, h, {
        isDone: true,
        isActive: false,
      }))

    // if done, ensure not active
    } else if (h.isDone) {
      return (Object.assign({}, h, {
        isActive: false,
      }))
    }

    // if not done then move on
    return (h)
  })

  // Count how many active cards the player has in their hand
  const nActive = playerHands.reduce((sum, h) => (
    h.isActive ? sum + 1 : sum
  ), 0)

  console.log(`There are ${nActive} active hands atm`)

  assert(nActive === 0 || nActive === 1,
    `Expected 0 or 1 active cards, got ${nActive}`,
  )

  let chips = Number(state.chips)
  const moves = []

  // if we have an active card then the round continues
  if (nActive === 1) {
    // these are always valid moves if the round is in progress
    moves.push('stand')
    moves.push('hit')

    // ah for Active Hand
    const ah = playerHands.find(h => h.isActive)

    // can we double down?
    if (ah.cards.length === 2 && chips >= ah.bet) {
      moves.push('double')
    }

    // can we split?
    if (ah.cards.length === 2 && chips >= ah.bet &&
        score([ah.cards[0]]).n === score([ah.cards[1]]).n) {
      moves.push('split')
    }

    return (Object.assign({}, state, { playerHands, moves }))
  }

  // No active cards, time for the dealer to go & payout

  // warning: shallow copies
  const deck = state.deck.slice()
  const dealerCards = state.dealerCards.slice()

  // make sure dealer's hand is played out
  while (score(dealerCards).n > 17 ||
         (score(dealerCards).n === 17 &&
          score(dealerCards).isSoft)) {
    dealerCards.push(deck.pop())
  }
  // ds for Dealer's Score
  const ds = score(dealerCards)

  let message
  for (let h=0; h<playerHands.length; h++) {
    // ps for Player's Score
    const ps = score(playerHands[h].cards)

    if (ps.bj && !ds.bj) {
      message = 'Blackjack! Congrats'
      chips += h.bet * 1.5
    } else if (ps.bj && ds.bj) {
      message = 'Blackjack! But the dealer also blackjacked..'
    } else if (ps.n > 21) {
      message = 'Bust!'
    } else if (ds.n > 21) {
      message = 'Dealer Bust!'
      chips += h.bet
    } else if (ps.n > ds.n) {
      message = 'Well played!'
      chips += h.bet
    } else if (ps.n === ds.n) {
      message = 'Tie...'
    } else if (ps.n < ds.n) {
      message = 'Better luck next time'
    }
  }
  
  moves.push('deal')
  return (Object.assign({}, state, {
    chips, playerHands, deck, dealerCards, message, moves,
  }))
}

export default sync
