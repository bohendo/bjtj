<?php

function eth_jsonrpc($eth_provider, $method, $params) {

  if (!$eth_provider) return false;
  $ch = curl_init($eth_provider);

  $data=json_encode(array(
    'id'=>1,
    'jsonrpc'=>'2.0',
    'method'=>$method,
    'params'=>$params
  ));

  // http://php.net/manual/en/function.curl-setopt.php
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
  curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'Content-Length: ' . strlen($data)
  ));

  $res = curl_exec($ch);
  $err = curl_error($ch);
  curl_close($ch);

  if ($err) return false;
  else return json_decode($res)->result;

}


function eth_net_id($eth_provider) {
  $method = 'net_version';
  $params = '';
  return eth_jsonrpc($eth_provider, $method, $params);
}

function eth_balance($eth_provider, $address) {
  $method = 'eth_getBalance';
  $params = $address;
  return eth_jsonrpc($eth_provider, $method, $params);
}

?>
