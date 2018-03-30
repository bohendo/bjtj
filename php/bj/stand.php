<?php

function bjtj_bj_stand($old_state) {
  $new_state = json_decode(json_encode($old_state));
  if (!in_array('stand', $new_state->moves)) {
    return $new_state;
  }

  $new_state->playerHands = array_map(function($hand) {
    if ($hand->isActive) {
      $hand->isActive = false;
      $hand->isDone = true;
    }
    return $hand;
  }, $old_state->playerHands);

  return bjtj_bj_sync($new_state);
}

?>
