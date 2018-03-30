<?php

function ranks($loc) {
  return array_map(function ($card) {
    return $card->rank;
  }, $loc);
};

function hasTen($loc) {
  return count(array_intersect(
    array('T', 'J', 'Q', 'K'),
    ranks($loc)
  )) >= 0;
};

function score_cards($loc) {

  // first: check for a blackjack
  if (
    count($loc) === 2 &&
    in_array('A',  ranks($loc)) &&
    hasTen($loc)
  ) {
    return (object) array('n'=>21,'isSoft'=>false,'bj'=>true);
  }

  return array_reduce($loc, function ($output, $card) {

    if ($card->rank === 'A') {
      if ($output->n >= 11) {
        $output->n += 1;
      } else {
        $output->n += 11;
        $output->isSoft += true;
      }
    } else if (hasTen(array($card))) {
      $output->n += 10;
    } else if (is_numeric($card->rank)) {
      $output->n += intval($card->rank, 10);
    }
    // else rank might be '?' in which case we ignore it

    if ($output->isSoft && $output->n > 21) {
      $output->isSoft = false;
      $output->n -= 10;
    }

    return $output;

  }, (object) array('n'=>0,'isSoft'=>false,'bj'=>false));

}

function bjtj_bj_sync($old_state) {
  $old_state = json_decode(json_encode($old_state));
  $new_state = json_decode(json_encode($old_state));
  //var_dump($old_state);var_dump($new_state);

  // Handle initial state
  if (count($old_state->playerHands) === 0) {
    if ($new_state->chips > 0) {
      $new_state->moves = array('deal');
      $new_state->message = "Click Deal when you're ready";
    } else {
      $new_state->moves = array();
      $new_state->message = "Tip 5 mETH to play with 5 more chips :)";
    }
    return $new_state;
  }

  // Dealer doesn't have a hidden card anymore? We're done then
  if (sizeof($old_state->hiddenCard) === 0) {
  }

  // Dealer peeks to check for Blackjack
  if (score_cards(array_merge(array($old_state->hiddenCard), $old_state->dealerCards))->bj) {
    $new_state->playerHands = array_map(function($hand) {
      $hand->isDone = true;
      $hand->isActive = false;
      return $hand;
    }, $old_state->playerHands);
    
  }

  // Update player Hands
  $new_state->playerHands = array_map(function($hand) {
    if (!$hand->isDone && score_cards($hand->cards)->n >= 21) {
      $hand->isDone = true;
    }
    if ($hand->isDone && $hand->isActive) {
      $hand->isActive = false;
    }
    return $hand;
  }, $old_state->playerHands);

  return $new_state;
}


function bjtj_bj_payout($old_state, $player_score, $dealer_score) {
  $new_state = $old_state;
  return $new_state;
}

?>
