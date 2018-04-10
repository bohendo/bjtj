<?php


function bjtj_get_provider_status($ethprovider) {
  if (!$ethprovider) {
    return "Please enter an ethereum provider that looks something like: http://localhost:8545";
  }

  $bjtj_net_id = eth_net_id($ethprovider);

  if (!$bjtj_net_id) {
    return "Unable to connect to $ethprovider";
  }

  return "Successfully connected to network <strong>$bjtj_net_id</strong>";
}



function bjtj_get_contract_status($ethprovider, $contract_address) {
  if (!$ethprovider) {
    return "Unable to connect to Ethereum provider";
  }
  if (!$contract_address) {
    return "Please enter a contract address that looks something like: 0x123456789abcdef0123456789abcdef012345678";
  }

  $deployedOn = eth_deployedOn($ethprovider, $contract_address);
  $contract_balance = eth_balance($ethprovider, $contract_address);

  if ($contract_balance === false || $deployedOn === false) {
    return "Unable to query this contract address";
  }

  $contract_balance = wei_to_meth($contract_balance);
  return "Balance: <strong>$contract_balance</strong> mETH".', deployed on block: <strong>'.$deployedOn.'</strong>';
}



function bjtj_get_dealer_status($ethprovider, $contract_address, $dealer_address) {
  if (!$ethprovider) {
    return "Unable to connect to Ethereum provider";
  }
  if (!$contract_address) {
    return "Unable to connect to BJTJ Contract";
  }
  if (!$dealer_address) {
    return "Please enter an Ethereum address you control to use as the dealer.";
  }

  $dealer_balance = eth_balance($ethprovider, $dealer_address);
  $dealer_bankroll = eth_bankroll($ethprovider, $contract_address, $dealer_address);

  if ($dealer_balance === false) {
    return "Unable to connect to Ethereum provider";
  }
  if ($dealer_bankroll === false) {
    return "Unable to query contract address";
  }

  $dealer_balance = wei_to_meth($dealer_balance);
  $dealer_bankroll = wei_to_meth($dealer_bankroll);

  return "Balance: <strong>$dealer_balance</strong> mETH, Dealer bankroll: <strong>$dealer_bankroll</strong> mETH";
}


function bjtj_get_event_status($ethprovider, $event_filter) {
  global $wpdb;

  if (!$ethprovider) {
    return "Unable to connect to Ethereum provider";
  }
  if (!$event_filter) {
    return "Event filter not initialized";
  }

  $npayments = $wpdb->get_var("SELECT COUNT(*) FROM ".$wpdb->prefix."bjtj_payments;");

  return "Searching for events using filter <strong>$event_filter</strong>, DB contains <strong>$npayments</strong> payments";
}

?>
