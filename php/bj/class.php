<?php

class Blackjack {

  public $message = "Let's play a game";
  public $moves = array('deal');
  public $bet = 1;
  public $chips = 3;
  public $playerHands = array();
  public $dealerCards = array();

  // TODO: make these private?
  public $deck = array();
  public $hiddenCard = array();
}

?>
