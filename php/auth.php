<?php

include ABSPATH.'wp-content/plugins/bjtj/include/keccak.php';
use kornrunner\Keccak;

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
  return Keccak::hash($ascii, 256);
}

function bjtj_hash_message($msg) {
  // hash(b72472 . ea0d08) = 0xe2e5ae
  return keccak( pack('H*', keccak('string Agreement').keccak($msg)));
}

function bjtj_auth($id, $ag) {

  global $agreement;
  $agreement_hash = bjtj_hash_message($agreement);

  //echo substr($agreement_hash, 0, 6);

  return true;
}

?>
