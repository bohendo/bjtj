<?php

function bjtj_bj_split($old_state) {
  $new_state = json_decode(json_encode($old_state));
  if (!in_array('split', $new_state->moves)) {
    return $new_state;
  }

  return bjtj_bj_sync($new_state);

}

?>
