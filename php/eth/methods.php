<?php


// returns wei
function eth_balance($eth_provider, $address) {
  $method = 'eth_getBalance';
  $params = array($address,'latest');
  $result = eth_jsonrpc($eth_provider, $method, $params);
  if (gettype($result) !== 'string') return false;
  if (!is_hex($result)) return false;
  return gmp_init(substr($result, 2), 16);
}


// returns wei
function eth_bankroll($eth_provider, $contract, $dealer) {
  $method = 'eth_call';
  $params = array(array(
    'to'=>$contract,
    'data'=>'0x'.substr(keccak('bankrolls(address)'), 0, 8).
      str_pad(substr($dealer,2), 64, '0', STR_PAD_LEFT)
  ), 'latest');
  $result = eth_jsonrpc($eth_provider, $method, $params);
  if (gettype($result) !== 'string') return false;
  if (!is_hex($result)) return false;
  return gmp_init(substr($result, 2), 16);
}


function eth_deployedOn($eth_provider, $contract) {
  $method = 'eth_call';
  $params = array(array(
    'to'=>$contract,
    'data'=>'0x'.substr(keccak('deployedOn()'), 0, 8)
  ), 'latest');
  $result = eth_jsonrpc($eth_provider, $method, $params);
  if (gettype($result) !== 'string') return false;
  if (!is_hex($result)) return false;
  return gmp_init(substr($result, 2), 16);
}


function eth_gas_price($eth_provider) {
  $method = 'eth_gasPrice';
  $params = array();
  $result = eth_jsonrpc($eth_provider, $method, $params);
  if (gettype($result) !== 'string') return false;
  if (!is_hex($result)) return false;
  return gmp_init(substr($result, 2), 16);
}


function eth_net_id($eth_provider) {
  $method = 'net_version';
  $params = array();
  $result = eth_jsonrpc($eth_provider, $method, $params);
  if (gettype($result) !== 'string') return false;
  return intval($result, 10);
}


function eth_nonce($eth_provider, $address) {
  $method = 'eth_getTransactionCount';
  $params = array( $address, 'latest');
  $result = eth_jsonrpc($eth_provider, $method, $params);
  if (gettype($result) !== 'string') return false;
  if (!is_hex($result)) return false;
  return gmp_init(substr($result, 2), 16);
}


?>
