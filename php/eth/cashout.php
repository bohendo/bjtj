<?php


function eth_cashout($state, $id) {

  $ethprovider = get_option('bjtj_ethprovider');
  $contract_address = get_option('bjtj_contract_address');
  $dealer_address = get_option('bjtj_dealer_address');

  $playerChips = $state->chips;
  if ($playerChips < 0.1) {
    $state->message = "No chips to cashout";
    return $state;
  }

  $dealerChips = wei_to_meth(eth_bankroll(
    $ethprovider, $contract_address, $dealer_address
  ));
  if ($dealerChips < 0.1) {
    $state->message = "Oh no, the dealer's broke. Try again later";
    return $state;
  }

  $toCash = $playerChips > $dealerChips ? $dealerChips : $playerChips;

  $tx = (object) array(
    'from'=>$dealer_address,
    'to'=>$contract_address,
    'value'=>"0x0",
    'data'=>'0x'
      .substr(keccak('cashout(address,uint256)'), 0, 8)
      .str_pad(substr($id,2), 64, '0', STR_PAD_LEFT)
      .str_pad(meth_to_hex_wei($toCash), 64, '0', STR_PAD_LEFT)
  );

  $hash = eth_sendTx($tx);

  if ($hash != false) {
    $state->chips -= $toCash;
    $state->message = 'Cashout tx: 0x'.$hash;
  } else {
    $state->message = "Couldn't send tx, try again later";
  }

  return $state;

}


?>
