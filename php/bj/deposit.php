<?php

function bjtj_bj_deposit($old_state, $chips=false) {
  $new_state = json_decode(json_encode($old_state));
  if (!$chips) {
    return $new_state;
  }

  $new_state->chips += $chips;

  return bjtj_bj_sync($new_state);
}

?>
