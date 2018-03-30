<?php

function bjtj_bj_hit($old_state) {
  $new_state = json_decode(json_encode($old_state));
  if (!in_array('hit', $new_state->moves)) {
    return $new_state;
  }

  $new_state->playerHands = array_map(function($hand) use ($new_state) {
    if ($hand->isActive) {
      return (object) array(
          'isActive' => true,
          'isDone' => false,
          'bet' => $hand->bet,
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
