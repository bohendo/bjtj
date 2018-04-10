<?php

include dirname(__FILE__).'/class.php';
include dirname(__FILE__).'/sync.php';

include dirname(__FILE__).'/deal.php';
include dirname(__FILE__).'/hit.php';
include dirname(__FILE__).'/stand.php';
include dirname(__FILE__).'/double.php';
include dirname(__FILE__).'/split.php';

function bjtj_bj_new_deck() {

  $ranks = array('A', '2', '3', '4', '5', '6',
    '7', '8', '9', 'T', 'J', 'Q', 'K');
  $suits = array('C', 'D', 'H', 'S');
  $deck = array();

  // Build a 52-card deck with all ranks/suits
  $nranks = count($ranks);
  for ($i=0; $i<$nranks; $i++) {

    $nsuits = count($suits);
    for ($j=0; $j<$nsuits; $j++) {

      array_push($deck, (object) array(
        'rank' => $ranks[$i],
        'suit' => $suits[$j]
      ));
    }
  }

  // Shuffle the deck
  for ($i=count($deck)-1; $i>=0; $i--) {
    $j = random_int(0, $i);
    $tmp = $deck[$j];
    $deck[$j] = $deck[$i];
    $deck[$i] = $tmp;
  }

  return $deck;
}

function bjtj_bj($state=false, $action=false, $chips=false) {

  if (!$state) { $state = new Blackjack(); }
  if (!$action) { $action = 'sync'; }

  switch($action) {

    case 'sync':
      return bjtj_bj_sync($state);

    case 'deal':
      return bjtj_bj_deal($state, bjtj_bj_new_deck());

    case 'hit':
      return bjtj_bj_hit($state);

    case 'stand':
      return bjtj_bj_stand($state);

    case 'double':
      return bjtj_bj_double($state);

    case 'split':
      return bjtj_bj_split($state);

    default:
      return bjtj_bj_sync($state);
  }

}

?>
