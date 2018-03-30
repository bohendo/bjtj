<?php

function bjtj_bj_cashout($old_state, $chips='all') {
  $new_state = json_decode(json_encode($old_state));
  if ($new_state->chips <= 0) {
    return $new_state;
  }

  if ($chips === 'all' || $chips >= $new_state->chips) {
    $new_state->chips = 0;
  } else {
    $new_state->chips -= $chips;
  }

  return bjtj_bj_sync($new_state);
}

?>
