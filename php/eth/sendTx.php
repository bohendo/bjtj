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


// technically LP, not RLP..
// Adds length prefix to hex string
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

  $tx->nonce = '0x'.gmp_strval(eth_nonce($ethprovider, $tx->from), 16);

  $sender = $tx->from;
  unset($tx->from);

  $rawTx = RLP($tx->nonce).RLP($tx->gasPrice).RLP($tx->gasLimit).RLP($tx->to).RLP().RLP($tx->data);

  $txHash = keccak($rawTx);

  $sig = Signature::getSignatureHashPoints($txHash, get_option('bjtj_dealer_key'));

  update_option('bjtj_debug', 'S: '.$sig['S'].' --- R: '.$sig['R']);


  // 0x
  // f8ad   - prefixes 173 bytes of data

  // 83     - prefixes 6 bytes of data
  // 211738 - nonce

  // 85    - prefixes n-80*2=10 bytes of data
  // 0ba43b7400 - gas price

  // 83    - prefixes 83-80*2=6 bytes of data
  // 019726  - gas limit

  // 94    - prefixes 0x94-0x80 = 20 * 2 = 40 bytes of data
  // 888666ca69e0f178ded6d75b5726cee99a87d698 - to

  // 80 - prefixes 0 bytes of data
  //    - value: none

  // b844 - prefixes 68 bytes of data
  // a9059cbb - data: method sig
  // 00000000000000000000000009a826dc7b7fc886da9cafb03f970efde26aa799 - data: param 1
  // 000000000000000000000000000000000000000000000002c64afdd37e0b0000 - data: param 2

  // 25 - v aka w aka recovery identifier or chain identifier * 2 + 35 or 36. Our chain identifier is 1 so 37 = 1*2+35 aka parity of y is even

  // a0 - 160, prefixes 32*2 bytes of data
  // 758270b622216fe61ccc98b13dbec248c6fabfa6f8d52593127f7ae48834f8ca

  // a0 - 160, prefixes 32*2 bytes of data
  // 0d08a2c85b95e547bc2ae858b85a1a8be383c680b77246ed5d36021467296479


  return $txHash;

}

function getGasPrice() {
  // query ethgasstation.info or similar
  return 2000000000;
}


?>
