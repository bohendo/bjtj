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

  if (count($bytes) == 1 && $bytes[0] < 128) {
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

  if (test_ecdsa() === false) return false;

  $input = json_encode($tx);

  $ethprovider = get_option('bjtj_ethprovider');
  $net_version = eth_net_id($ethprovider);

  $tx->nonce = gmp_strval(eth_nonce($ethprovider, $tx->from), 16);
  $tx->gasPrice = gmp_strval(gmp_init(getGasPrice()), 16);
  $tx->gasLimit = gmp_strval(gmp_init(100000), 16);
  $tx->value = gmp_strval(gmp_init($tx->value), 16);

  // make sure the sender can pay for this much gas
  if (gmp_cmp(
    eth_balance($ethprovider, $tx->from),
    gmp_mul(
      gmp_init($tx->gasPrice,16),
      gmp_init($tx->gasLimit,16)
    )
  ) <= 0) {
    return false;
  }

  $rawTx = RLP($tx->nonce).RLP($tx->gasPrice).RLP($tx->gasLimit).RLP($tx->to).RLP($tx->value).RLP($tx->data);

  // Append a replay-resistant signature placeholder according to EIP155
  // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md
  $fakeTx = LP($rawTx.RLP(dechex($net_version)).'8080');

  $txHash = keccak(pack('H*',$fakeTx));

  $sig = ecdsa_sign($txHash, get_option('bjtj_dealer_key'));
  $sig['v'] += $net_version * 2;

  // Sanity checks to make sure the signature is valid
  $addr = '0x'.substr(keccak(pack('H*',ecdsa_recover($txHash, $sig))),-40);
  if ($addr !== $tx->from) {
    update_option('bjtj_debug', "Sanity check failed sending: $input <br/> $fakeTx <br/> $txHash <br/> r=".$sig['r']." <br/> s=".$sig['s']." <br/> v=".$sig['v']."<br/> $addr !== ".$tx->from);
    return false;
  }

  $signedTx = '0x'.LP($rawTx.RLP(strval(dechex($sig['v']))).RLP($sig['r']).RLP($sig['s']));

  // Give the signed Tx to our ethprovider to broadcast
  $method = 'eth_sendRawTransaction';
  $params = array($signedTx);
  $result = eth_jsonrpc($ethprovider, $method, $params);

  $result = json_encode($result);
  update_option('bjtj_debug', "0x$fakeTx <br/> 0x$txHash <br/> r=".$sig['r']." <br/> s=".$sig['s']." <br/> v=".$sig['v']."<br/>".$result);
  if (!$result || property_exists($result, 'error')) return false;

  return '0x'.$txHash;
}

function getGasPrice() {
  // query ethgasstation.info or similar
  return 2000000000;
}


?>
