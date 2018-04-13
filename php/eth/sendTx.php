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
function RLP($hexstr = '') {
  if (gettype($hexstr) == 'string') {
    $tmp = strval($hexstr);
  } else {
    $tmp = $hexstr;
  }

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


function eth_sendTx($tx) {

  $ethprovider = get_option('bjtj_ethprovider');

  $tx->nonce = '0x'.gmp_strval(eth_nonce($ethprovider, $tx->from), 16);
  $tx->gasPrice = '0x'.gmp_strval(gmp_init(getGasPrice()), 16);
  $tx->gasLimit = '0x'.gmp_strval(gmp_init(100000), 16);

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

  $rawTx = RLP($tx->nonce).RLP($tx->gasPrice).RLP($tx->gasLimit).RLP($tx->to).RLP().RLP($tx->data);

  $txHash = keccak(pack('H*',$rawTx));

  $sig = ecdsa_sign($txHash, get_option('bjtj_dealer_key'));


  // Sanity checks to make sure the signature is valid
  if (!$sig) { return false; }
  $addr = '0x'.substr(keccak(pack('H*',ecdsa_recover($txHash, $sig))),-40);
  if ($addr !== $tx->from) {
    update_option('bjtj_debug', "$txHash <br/> $addr !== ".$tx->from." <br/> r=".$sig['r']." <br/> s=".$sig['s']." <br/> v=".$sig['v']);
    return false;
  }

  // Finish building the raw transaction
  $rawTx .= RLP(strval(dechex($sig['v']))).RLP($sig['r']).RLP($sig['s']);
  $txLen = dechex(strlen($rawTx)/2);
  $rawTx = '0xf8'.$txLen.$rawTx;


  // Give the rawTx to our ethprovider to broadcast
  $method = 'eth_sendRawTransaction';
  $params = array($rawTx);
  $result = eth_jsonrpc($ethprovider, $method, $params);

  $result = json_encode($result);
  update_option('bjtj_debug', $result);

  if (!$result) return false;

  return $txHash;

}

function getGasPrice() {
  // query ethgasstation.info or similar
  return 2000000000;
}


?>
