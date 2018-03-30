<?php

function bjtj_bj_deal($old_state, $new_deck) {
  $new_state = new Blackjack();
  if (!in_array('deal', $new_state->moves)) {
    return $new_state;
  }

  $new_state->chips = $old_state->chips - $old_state->bet;

  $new_state->deck = $new_deck;

  $new_state->hiddenCard = array_pop($new_state->deck);
  $new_state->dealerCards = array(
    array(
      'rank' => '?',
      'suit' => '?'
    ),
    array_pop($new_state->deck)
  );

  $new_state->playerHands = array(
    array(
      'isActive' => true,
      'isDone' => false,
      'bet' => $old_state->bet,
      'cards' => array(
        array_pop($new_state->deck),
        array_pop($new_state->deck)
      ),
    )
  );

  // sync will set new message & move properties
  return bjtj_bj_sync($new_state);

}

?>
