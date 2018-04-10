<?php


add_filter('update_option_bjtj_ethprovider', 'eth_save_all_payments');
add_filter('update_option_bjtj_contract_address', 'eth_save_all_payments');
add_filter('update_option_bjtj_dealer_address', 'eth_save_all_payments');

function eth_save_all_payments() {
  return eth_save_payments(true);
}

function eth_save_new_payments() {
  return eth_save_payments(false);
}

function eth_save_payments($get_old) {
  global $wpdb;

  $ethprovider = get_option('bjtj_ethprovider');

  if(eth_net_id($ethprovider) === false) {
    return false;
  }

  $contract_address = get_option('bjtj_contract_address');
  $dealer_address = get_option('bjtj_dealer_address');

  if($contract_address == false || $dealer_address == false) {
    return false;
  }

  $event_filter = get_option('bjtj_event_filter');
  if($event_filter == false) {
    $deployedOn = eth_deployedOn($ethprovider, $contract_address);

    $method = 'eth_newFilter';
    $params = array(array(
      'fromBlock'=>'0x'.dechex($deployedOn),
      'toBlock'=>'latest',
      'address'=>$contract,
      'topics'=>array(
        '0x'.keccak('Deposit(address,address,uint256)'),
        '0x'.str_pad(substr($dealer,2), 64, '0', STR_PAD_LEFT)
      )
    ));
    $event_filter = eth_jsonrpc($ethprovider, $method, $params);
    if (!$event_filter) return false;

    update_option('bjtj_event_filter', $event_filter);
  }


  $method = $get_old ? 'eth_getFilterLogs' : 'eth_getFilterChanges';
  $params = array($event_filter);
  $events = eth_jsonrpc($ethprovider, $method, $params);
  if (!$events) return false;

  $sql = "INSERT INTO ".$wpdb->prefix."bjtj_payments (`hash`,`sender`,`recipient`,`value`,`paid`,`modified`) VALUES (%s,%s,%s,%s,%d,%s) ON DUPLICATE KEY UPDATE `modified` = %s;";

  foreach($events as $event) {
    $wpdb->query($wpdb->prepare($sql,
      $event->transactionHash,
      '0x'.substr($event->topics[2], 26),
      '0x'.substr($event->topics[1], 26),
      gmp_strval(gmp_init($event->data, 16)),
      0,
      current_time('mysql', 1),
      current_time('mysql', 1)
    ));
  }

}



?>
