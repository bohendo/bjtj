<?php


function eth_jsonrpc($eth_provider, $method, $params) {

  if (!$eth_provider) return false;
  $ch = curl_init($eth_provider);

  $data=json_encode(array(
    'id'=>271828,
    'jsonrpc'=>'2.0',
    'method'=>$method,
    'params'=>$params
  ));

  // http://php.net/manual/en/function.curl-setopt.php
  curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 1);
  curl_setopt($ch, CURLOPT_TIMEOUT, 2);
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

  if ($err) {
    update_option('bjtj_debug', json_encode($err));
    return false;
  }

  if (property_exists($res, 'error')) {
    update_option('bjtj_debug', json_encode($res->error));
    return false;
  }

  if (property_exists($res, 'result')) {
    return $res->result;
  }

  return false;

}


?>
