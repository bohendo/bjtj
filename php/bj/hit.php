<?php

function bjtj_bj_hit($old_state) {
  $new_state = json_decode(json_encode($old_state));
  if (!in_array('hit', $new_state->moves)) {
    return $new_state;
  }

  $new_state->playerHands = array_map(function($h) {
    if ($h['isActive']) {

      return array(
          'isActive' => true,
          'isDone' => false,
          'bet' => $h['bet'],
          'cards' => array_push(
            $h['cards'],
            array_pop($new_state->deck)
          )
      );

    }
    return h;

  }, $old_state->playerHands);

  return bjtj_bj_sync($new_state);
}

?>
