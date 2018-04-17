<?php

function evenify($str) {
  if (strlen($str) % 2 ==0) {
    return $str;
  }
  return '0'.$str;
}

function toHex($byte) {
  return evenify(dechex($byte));
}


// technically not RLP, more like LP
// Adds length prefix to a hex string
// See Ethereum yellow paper equation (179)
function RLP($hexstr = '') {
  $tmp = $hexstr;
  $bytes = array();
  if (substr($tmp, 0, 2) === '0x') {
    $tmp = substr($tmp, 2);
  }
  $tmp = evenify($tmp);
  for ($i=0; $i<strlen($tmp); $i += 2) {
    array_push($bytes, hexdec(substr($tmp, $i, 2)));
  }

  if (count($bytes) == 1 && $bytes[0] == 0) {
    return '80';
  } else if (count($bytes) == 1 && $bytes[0] < 128) {
    return evenify(dechex($bytes[0]));

  } else if (count($bytes) < 56) {
    return implode(array_merge(
      array(dechex(128+count($bytes))),
      array_map('toHex', $bytes)
    ));

  } else {
    $be = dechex(count($bytes));
    if (strlen($be) % 2 !== 0) {
      $be = '0'.$be;
    }

    return implode(array_merge(
      array(dechex(183+strlen($be)/2)),
      array($be),
      array_map('toHex', $bytes)
    ));

  }
}


// Puts the R in RLP.. not really
// Adds a length prefix to LP'd hex data
// See Ethereum yellow paper equation (182)
function LP($rlp = '') {
  $tmp = $rlp;
  if (substr($tmp, 0, 2) === '0x') {
    $tmp = substr($tmp, 2);
  }
  $tmp = evenify($tmp);
  $txLen = strlen($tmp)/2;
  if ($txLen < 56) {
    return dechex(192+$txLen).$tmp;
  }
  $lenLen = strlen(dechex($txLen))/2;
  return dechex(247+$lenLen).dechex($txLen).$tmp;
}


function eth_sendTx($tx) {

  if (test_suite() === false) return false;

  $ethprovider = get_option('bjtj_ethprovider');
  $net_version = eth_net_id($ethprovider);

  $from = $tx->from;
  unset($tx->from);

  // Define internal tx fields & re-encode to strip 0x prefix, etc
  $tx->nonce = gmp_strval(eth_nonce($ethprovider, $from), 16);
  $tx->gasPrice = gmp_strval(gmp_init(getGasPrice()), 16);
  $tx->gasLimit = gmp_strval(gmp_init(100000), 16);
  $tx->to = gmp_strval(gmp_init($tx->to), 16);
  $tx->value = gmp_strval(gmp_init($tx->value), 16);
  $tx->data = gmp_strval(gmp_init($tx->data), 16);

  $input = json_encode($tx, JSON_PRETTY_PRINT);

  // make sure the sender can pay for this much gas
  if (gmp_cmp(
    eth_balance($ethprovider, $from),
    gmp_mul(
      gmp_init($tx->gasPrice,16),
      gmp_init($tx->gasLimit,16)
    )
  ) <= 0) {
    return false;
  }


  // Transaction Hash is a hash of raw concatenated values:
  // nonce, gas price, gas limit, to, value, data, chain id

  // Append a replay-resistant signature placeholder according to EIP155
  // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md

  $txHash = keccak(''
    .pack('H*',$tx->nonce)
    .pack('H*',$tx->gasPrice)
    .pack('H*',$tx->gasLimit)
    .pack('H*',$tx->to)
    .pack('H*',$tx->value)
    .pack('H*',$tx->data)
    .pack('H*',$net_version)
  );

  $rawTx = RLP($tx->nonce).RLP($tx->gasPrice).RLP($tx->gasLimit).RLP($tx->to).RLP($tx->value).RLP($tx->data);
  $fakeTx = LP($rawTx.RLP(dechex($net_version)).'8080');
  $txHash = keccak(pack('H*', $fakeTx));

  $sig = ecdsa_sign($txHash, get_option('bjtj_dealer_key'));
  $sig['v'] += $net_version * 2;

  // Sanity checks to make sure the signature is valid
  $addr = '0x'.substr(keccak(pack('H*',ecdsa_recover($txHash, $sig))),-40);
  if ($addr !== $from) {
    update_option('bjtj_debug', "Sanity check failed sending: $input <br> $fakeTx <br> <br> h='$txHash' <br> r='".$sig['r']."' <br> s='".$sig['s']."' <br> v='".$sig['v']."'<br> recovered $addr !== from ".$from);
    return false;
  }

  $rawTx = RLP($tx->nonce).RLP($tx->gasPrice).RLP($tx->gasLimit).RLP($tx->to).RLP($tx->value).RLP($tx->data);
  $signedTx = '0x'.LP($rawTx.RLP(strval(dechex($sig['v']))).RLP($sig['r']).RLP($sig['s']));

  // Give the signed Tx to our ethprovider to broadcast
  $method = 'eth_sendRawTransaction';
  $params = array($signedTx);
  $result = eth_jsonrpc($ethprovider, $method, $params);

  $output = json_encode($result, JSON_PRETTY_PRINT);

  if (!$result || property_exists($result, 'error')) {
    update_option('bjtj_debug', "Error from provider while sending: $input <br> <br> $fakeTx <br> h='$txHash' <br> r='".$sig['r']."' <br> s='".$sig['s']."' <br> v='".$sig['v']."'<br> $output");
    return false;
  }

  return '0x'.$txHash;
}

function getGasPrice() {
  // query ethgasstation.info or similar
  return 2000000000;
}


?>
