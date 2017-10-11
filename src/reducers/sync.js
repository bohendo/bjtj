
import assert from 'assert'
import { score } from './utils'

const sync = (state) => {
  // Gather data from state
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

  let chips = Number(state.chips)
  const moves = []

  // warning: shallow copies
  const deck = state.deck.slice()
  const dealerCards = state.dealerCards.slice()

  let message

  // Syncing the initial state..
  if (playerHands.length === 0) {
    if (chips >= state.defaultBet) {
      moves.push('deal')
    }
    return (Object.assign({}, state, { playerHands, moves }))
  }

  // Cut things off if the dealer has a blackjack
  if (score(dealerCards).bj) {
    message = 'Dealer got a blackjack'
    playerHands[0].isDone = true
    playerHands[0].isActive = false
    if (chips >= state.defaultBet) {
      moves.push('deal')
    }
    return (Object.assign({}, state, { playerHands, moves, message }))
   }

  // Count how many active cards the player has in their hand
  const nActive = playerHands.reduce((sum, h) => (
    h.isActive ? sum + 1 : sum
  ), 0)

  // Count how many active cards the player has in their hand
  const nTodo = playerHands.reduce((sum, h) => (
    h.isDone ? sum : sum + 1
  ), 0)

  assert(nActive === 0 || nActive === 1,
    `Expected 0 or 1 active cards, got ${nActive}`,
  )

  // if we still have un-finished hands then the round continues
  if (nTodo !== 0) {

    // if no cards are active, activate one
    let ah // ah for Active Hand
    if (nActive === 0) {
      for (let i=0; i<playerHands.length; i++) {
        if (!playerHands[i].isActive && !playerHands[i].isDone) {
          playerHands[i].isActive = true;
          ah = playerHands[i]
          break
        }
      }
    } else {
      ah = playerHands.find(h => h.isActive)
    }

    // these are always valid moves if the round is in progress
    moves.push('stand')
    moves.push('hit')

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

  // make sure dealer's hand is played out
  while (score(dealerCards).n < 17 ||
         (score(dealerCards).n === 17 &&
          score(dealerCards).isSoft)) {
    dealerCards.push(deck.pop())
  }
  // ds for Dealer's Score
  const ds = score(dealerCards)

  for (let h=0; h<playerHands.length; h++) {
    // ps for Player's Score
    const ps = score(playerHands[h].cards)
    const bet = playerHands[h].bet

    if (ps.bj && !ds.bj) {
      message = 'Blackjack! Congrats'
      chips += bet * 2.5
    } else if (ps.bj && ds.bj) {
      message = 'Blackjack! But the dealer also blackjacked..'
      chips += bet
    } else if (ps.n > 21) {
      message = 'Bust!'
    } else if (ds.n > 21) {
      message = 'Dealer Bust!'
      chips += bet
    } else if (ps.n > ds.n) {
      message = 'Well played!'
      chips += 2 * bet
    } else if (ps.n === ds.n) {
      message = 'Tie...'
      chips += bet
    } else if (ps.n < ds.n) {
      message = 'Better luck next time'
    }
  }
  
  if (chips >= state.defaultBet) {
    moves.push('deal')
  }
  return (Object.assign({}, state, {
    chips, playerHands, deck, dealerCards, message, moves,
  }))
}

export default sync
