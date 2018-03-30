<?php

function bjtj_bj_stand($old_state) {
  $new_state = json_decode(json_encode($old_state));
  if (!in_array('stand', $new_state->moves)) {
    return $new_state;
  }

  $new_state->playerHands = array_map(function($h) {
    if ($h['isActive']) {

      return array(
          'isActive' => false,
          'isDone' => true,
          'bet' => $h['bet'],
          'cards' => $h['cards']
      );

    }
    return h;

  }, $old_state->playerHands);

  return bjtj_bj_sync($new_state);

}

?>
