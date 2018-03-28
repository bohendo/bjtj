<?php

class Blackjack {
  public $message = "Let's play a game";
  public $chips = 3;
  public $moves = array('deal');
  private $hidden = array(
    'rank' => 'A',
    'suit' => 'J'
  );
}

function bjtj_bj($state=false, $action=false) {

  if (!$state) { $state = new Blackjack(); }
  if (!$action) { $action = 'sync'; }

  return $state;

}

?>
