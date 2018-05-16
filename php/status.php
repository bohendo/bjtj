<?php


function bjtj_get_provider_status($ethprovider) {
  if (!$ethprovider) {
    return "Please enter an ethereum provider that looks something like: http://localhost:8545";
  }

  $bjtj_net_id = eth_net_id($ethprovider);
  $bjtj_gas_price = eth_gas_price($ethprovider);

  if (!$bjtj_net_id) {
    return "Unable to connect to $ethprovider";
  }

  return "Successfully connected to network <strong>$bjtj_net_id</strong> <br> Gas price: <strong>$bjtj_gas_price</strong>";
}



function bjtj_get_contract_status($ethprovider, $contract_address) {
  if (!$ethprovider) {
    return "Unable to connect to Ethereum provider";
  }

  if (!$contract_address) {
    return "Please enter a contract address that looks something like: 0x2610a8d6602d7744174181348104dafc2ad94b28";
  }

  $deployedOn = eth_deployedOn($ethprovider, $contract_address);
  $contract_balance = eth_balance($ethprovider, $contract_address);

  if ($contract_balance === false) {
    return "Unable to connect to Ethereum provider";
  }

  $contract_balance = display_wei($contract_balance);

  if ($deployedOn === false) {
    return "Balance: <strong>$contract_balance</strong> mETH <br> Error: Contract method call failed";
  }

  return "Balance: <strong>$contract_balance</strong> mETH <br> Deployed on block: <strong>$deployedOn</strong>";
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
  $dealer_nonce = eth_nonce($ethprovider, $dealer_address);

  if ($dealer_balance === false || $dealer_nonce === false) {
    return "Unable to connect to Ethereum provider";
  }

  $dealer_balance = display_wei($dealer_balance);

  if ($dealer_bankroll === false) {
    return "Balance: <strong>$dealer_balance</strong> mETH <br> Nonce: <strong>$dealer_nonce</strong> <br> Error: Contract method call failed";
  }

  $dealer_bankroll = display_wei($dealer_bankroll);
  return "Balance: <strong>$dealer_balance</strong> mETH <br> Bankroll: <strong>$dealer_bankroll</strong> mETH <br> Nonce: <strong>$dealer_nonce</strong>";
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

  if (!$npayments) {
    return "Searching for events using filter <strong>$event_filter</strong> <br> Error: Unable to query database";
  }

  return "Searching for events using filter <strong>$event_filter</strong> <br> DB contains <strong>$npayments</strong> payments";
}

?>
