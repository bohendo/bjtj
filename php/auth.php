<?php

$agreement = 'I understand and agree that
this game is an elaborate tip jar.
Although I expect to be able to
exchange my chips for Ether,
I am at peace knowing that the
site owner may, at any time and
for any reason, be unable or
unwilling to refund my chips.
';

// (ascii_string) => hex_string
function keccak($ascii) {
  // cache results if we notice performance problems
  return kornrunner\Keccak::hash($ascii, 256);
}

// This works just like eth-sig-util's typedSignatureHash
// https://github.com/MetaMask/eth-sig-util/blob/master/index.js#L77
function bjtj_hash_string($str) {
  return keccak( pack('H*', keccak('string Agreement').keccak($str)));
}

// id for identification aka ethereum address
// ag for autograph aka id's signature of above agreement
function bjtj_auth($id, $ag) {
  global $agreement;

  $hash = bjtj_hash_string($agreement);

  $sig = array(
    'r' => substr($ag, 0+2, 64),
    's' => substr($ag, 64+2, 64),
    'v' => hexdec(substr($ag, 128+2, 2))
  );

  $pubKey = ecdsa_recover($hash, $sig);
  if ($pubKey === false || gettype($pubKey) !== 'string') { return false; }
  $addr = '0x'.substr(keccak(pack('H*', $pubKey)), 24, 40);

  return $addr == $id;
}

?>
