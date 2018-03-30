<?php

function eth_listen($eth_provider, $address) {
  // $address is the location of the dealer contract
  return false;
}

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

  $res = json_decode(curl_exec($ch));
  $err = curl_error($ch);
  curl_close($ch);

  if ($err) return false;
  else if (property_exists($res, 'result')) return $res->result;
  else return false;

}


function eth_net_id($eth_provider) {
  $method = 'net_version';
  $params = '';
  $result = eth_jsonrpc($eth_provider, $method, $params);
  if (!$result) return false;
  return intval($result, 10);
}

function eth_balance($eth_provider, $address) {
  $method = 'eth_getBalance';
  $params = $address;
  $result = eth_jsonrpc($eth_provider, $method, $params);
  if (!$result) return false;
  return gmp_init(substr($result, 2), 16);
}


function wei_to_meth($wei) {
  $meth = (string) gmp_div_q($wei, gmp_pow(10,12));

  if (strlen($meth) > 3) {
    $meth = substr_replace($meth,'.',-3,0);
  }

  if (strlen($meth) > 6) {
    $meth = substr_replace($meth,',',-7,0);
  }
  return $meth;
}

?>
