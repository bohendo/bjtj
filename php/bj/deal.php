<?php

function bjtj_bj_deal($old_state, $new_deck) {

  $state = new Blackjack();

  $state->chips = $old_state->chips-1;

  $state->bet = $old_state->bet;

  $state->deck = $new_deck;

  $state->playerHands = array(
    array(
      'cards' => array(
        array_pop($state->deck),
        array_pop($state->deck)
      ),
      'isActive' => true,
      'isDone' => false
    )
  );

  $state->hiddenCard = array_pop($state->deck);

  $state->dealerCards = array(
    array(
      'rank' => '?',
      'suit' => '?'
    ),
    array_pop($state->deck)
  );

  return bjtj_bj_sync($state);

}

?>
