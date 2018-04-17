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
  )) > 0;
};

function score_cards($cards) {

  // loc for list of cards that are valid
  $loc = array_filter($cards, function ($card) { return $card->rank != '?'; });

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
        $output->isSoft = true;
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

  if ( ### Initial State or already paid out
    count($old_state->playerHands) === 0 ||
    $old_state->hiddenCard === false
  ) {
    if ($new_state->chips > 0) {
      $new_state->moves = array('deal');
      $new_state->message = "Click Deal when you're ready";
    } else {
      $new_state->moves = array();
      $new_state->message = "Tip 5 mETH to play with 5 chips :)";
    }
    return $new_state;
  }

  // Dealer peeks to check for Blackjack
  if (score_cards(array_merge(array($old_state->hiddenCard), $old_state->dealerCards))->bj) {
    return bjtj_bj_payout($new_state);
  }

  // Update player Hands
  $new_state->playerHands = array_map(function($hand) {
    if (score_cards($hand->cards)->n >= 21) {
      $hand->isDone = true;
    }
    $hand->isActive = false;
    return $hand;
  }, $old_state->playerHands);

  // Are all of the players hands done? No? activate one.
  $allDone = true;
  foreach($new_state->playerHands as $hand) {
    if (!$hand->isDone) {
      $hand->isActive = true; // TODO: verify that this in-place edit works
      $allDone = false;
      break;
    }
  }

  if ($allDone) {
    return bjtj_bj_payout($new_state);
  }

  $new_state->message = 'Make your move...';
  $new_state->moves = array('hit', 'stand');

  if (
    count($new_state->playerHands) === 1 &&
    count($new_state->playerHands[0]->cards) === 2 &&
    $new_state->chips >= $new_state->bet
  ) {
    array_push($new_state->moves, 'double');
    if (score_cards(array($new_state->playerHands[0]->cards[0]))->n === score_cards(array($new_state->playerHands[0]->cards[1]))->n) {
      array_push($new_state->moves, 'split');
    }
  }

  return $new_state;
}


function bjtj_bj_payout($old_state) {
  $new_state = json_decode(json_encode($old_state));

  // Make sure player's hand is finished
  $new_state->playerHands = array_map(function($hand) {
    $hand->isDone = true;
    $hand->isActive = false;
    return $hand;
  }, $old_state->playerHands);

  // Flip dealer's hidden card
  $new_state->dealerCards = array_merge(
    array($old_state->hiddenCard),
    array_filter(
      $old_state->dealerCards,
      function ($card) { return $card->rank != '?'; }
    )
  );
  $new_state->hiddenCard = false;

  // Deal cards until the dealer is done
  while (true) {
    $score = score_cards($new_state->dealerCards);
    if ($score->n > 17 || ($score->n === 17 && !$score->isSoft)) {
      break;
    }
    array_push($new_state->dealerCards, array_pop($new_state->deck));
  }

  $dealer = score_cards($new_state->dealerCards);

  $new_state->message = "";
  $net = 0;
  foreach($old_state->playerHands as $hand) {

    $player = score_cards($hand->cards);

    if ($dealer->bj && $player->bj) {
      $new_state->message .= "BJ Tie! ";
      $new_state->chips += $hand->bet;
      $net += $hand->bet;

    } else if ($dealer->bj) {
      $new_state->message = "Dealer got Blackjack! ";

    } else if ($player->bj) {
      $new_state->message .= "Blackjack! ";
      $new_state->chips += $hand->bet * 2.5;
      $net += $hand->bet *2.5;

    } else if ($player->n > 21) {
      $new_state->message .= "Bust! ";

    } else if ($dealer->n > 21) {
      $new_state->message = "Dealer bust! ";
      $new_state->chips += $hand->bet * 2;
      $net += $hand->bet *2;

    } else if ($player->n > $dealer->n) {
      $new_state->message .= "$player->n beats $dealer->n! ";
      $new_state->chips += $hand->bet * 2;
      $net += $hand->bet *2;

    } else if ($player->n < $dealer->n) {
      $new_state->message .= "$player->n loses to $dealer->n! ";

    } else if ($player->n === $dealer->n) {
      $new_state->message .= "Tie! ";
      $new_state->chips += $hand->bet;
      $net += $hand->bet;
    }
  }

  if ($net <= 0) {
    $new_state->message .= " No chips for you :(";
  } else if ($net === 1) {
    $new_state->message .= " You get $net chip";
  } else {
    $new_state->message .= " You win $net chips :)";
  }

  // Can the player play another hand?
  if ($new_state->chips > 0) {
    $new_state->moves = array('deal');
  } else {
    $new_state->moves = array();
  }

  return $new_state;
}

?>
