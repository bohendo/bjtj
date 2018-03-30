<?php

function bjtj_bj_double($old_state) {
  $new_state = json_decode(json_encode($old_state));
  if (!in_array('double', $new_state->moves)) {
    return $new_state;
  }

  $new_state->chips = $old_state->chips - $old_state->bet;

  $new_state->playerHands = array_map(function($hand) use ($new_state) {
    if ($hand->isActive) {
      return (object) array(
          'isActive' => false,
          'isDone' => true,
          'bet' => $hand->bet * 2,
          'cards' => array_merge(
            $hand->cards,
            array(array_pop($new_state->deck))
          )
      );
    }
    return $hand;

  }, $old_state->playerHands);


  return bjtj_bj_sync($new_state);
}

?>
