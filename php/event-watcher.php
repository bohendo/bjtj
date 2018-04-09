<?php

// verifies connection to ethprovider
// starts event watcher if it isn't already

// returns true if event watcher is watching
// returns false otherwise

function bjtj_watch_events($ethprovider) {

  if(!eth_net_id($ethprovider)) {
    return false;
  }

  $bn = eth_deployedOn($ethprovider, get_option('bjtj_contract_address'));

  if ($bn) {
    echo $bn;
  }


}


function eth_event_filter($eth_provider, $contract, $dealer) {
  $method = 'eth_newFilter';
  $params = array(array(
    'fromBlock'=>'0x1',
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
