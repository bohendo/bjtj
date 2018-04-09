<?php

// verifies connection to ethprovider
// starts event watcher if it isn't already

// returns true if event watcher is watching
// returns false otherwise

add_filter('update_option_bjtj_ethprovider', 'eth_watch_events', 10, 0);
add_filter('update_option_bjtj_contract_address', 'eth_watch_events', 10, 0);
add_filter('update_option_bjtj_dealer_address', 'eth_watch_events', 10, 0);

function eth_watch_events() {
  $ethprovider = get_option('bjtj_ethprovider');

  if(eth_net_id($ethprovider) === false) {
    return false;
  }

  $contract_address = get_option('bjtj_contract_address');
  $dealer_address = get_option('bjtj_dealer_address');

  $deployedOn = eth_deployedOn($ethprovider, $contract_address);

  $event_filter = eth_event_filter($ethprovider, $contract_address, $dealer_address, $deployedOn);

  update_option('bjtj_event_filter', $event_filter);

}


function eth_event_filter($eth_provider, $contract, $dealer, $deployedOn) {
  $method = 'eth_newFilter';
  $params = array(array(
    'fromBlock'=>$deployedOn,
    'toBlock'=>'latest',
    'address'=>$contract//,
    //array(str_pad(substr($dealer,2), 64, '0', STR_PAD_LEFT))
  ));
  $result = eth_jsonrpc($eth_provider, $method, $params);
  if (!$result) return false;
  else return $result;
}


function eth_get_events($eth_provider, $filter_id) {
  $method = 'eth_getFilterChanges';
  $params = array($filter_id);
  $result = eth_jsonrpc($eth_provider, $method, $params);
  if (!$result) return false;
  else return $result;
}

?>
