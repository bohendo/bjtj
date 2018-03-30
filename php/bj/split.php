<?php

function bjtj_bj_split($old_state) {
  $new_state = json_decode(json_encode($old_state));
  if (!in_array('split', $new_state->moves)) {
    return $new_state;
  }

  $new_state->chips = $old_state->chips - $old_state->bet;

  // get the hand-to-split
  $toSplit = array_filter($new_state->playerHands, function($hand) { return $hand->isActive; });

  // remove the hand to split from our hands
  $new_state->playerHands = array_filter($new_state->playerHands, function($hand) { return !$hand->isActive; });

  $new_state->playerHands[] = (object) array(
    'isActive' => true,
    'isDone' => false,
    'bet' => $new_state->bet,
    'cards' => array(
      $toSplit[0]->cards[0],
      array_pop($new_state->deck)
    )
  );

  $new_state->playerHands[] = (object) array(
    'isActive' => false,
    'isDone' => false,
    'bet' => $new_state->bet,
    'cards' => array(
      $toSplit[0]->cards[1],
      array_pop($new_state->deck)
    )
  );

  return bjtj_bj_sync($new_state);
}

?>
