<?php


/*

ECDSA: Elliptic Curve Digital Signing Algorithm

We have some universally known parameters that
 1. define an elliptic curve
 2. define a starting point G somewhere on this curve
 3. define the modulo order n (prime)

We generate a random number in the range [1,n-1] to use as our private key.

We can calculate a public key by doing EC-point-multiplication (ECPM) between G and our private key
ie public key = ECPM(private-key, G)

To create a digital signature of some message m:
 1. e = HASH(m)
 2. z = leftmost bits of e such that bitlength(z) <= (bitlength(n)
 3. k = random number (Or a deterministic number generated as described by rfc6979)
 4. (x1,y1) = ECPM(k, G)
 5. R = x1 mod n (if R ==0, select a new k)
 6. S = (z + R * private-key) / k mod n (if S == 0, select a new k)
 7. Signature = (R,S)

To verify this signature
 1. make sure R & S are within [1,n-1]
 2. e = HASH(m)
 3. z = leftmost bits of e such that bitlength(z) <= (bitlength(n)
 4. w = 1/s mod n
 5. u1 = z*w mod n
 6. u2 = r*w mod n
 7. (x1,y1) = ECPM(u1, G) + ECPM(u2, public-key)
 8. Signature is valid if R == x1 mod n

*/


function ecdsa_pubkey($key) {

  $pk = new PrivateKey($key);

  $points = $pk->getPubKeyPoints();

  $pubkey = $points['x'].$points['y'];

  return $pubkey;
}


function ecdsa_sign($hash, $key) {

  $v1 = 36;
  $v2 = 37;

  // reddit.com/r/ethereum/comments/6g7e94/how_does_ethereum_solve_dsa_k_value_collisions/
  $nonce = keccak(keccak($hash).keccak($key));

  $points = Signature::getSignatureHashPoints($hash, $key, $nonce);

  $sig = array(
    'v'=>$v1,
    'r'=>$points['R'],
    's'=>$points['S']
  );

  $prvToPub = ecdsa_pubkey($key);
  $recovered = ecdsa_recover($hash, $sig['v'], $sig['r'], $sig['s']);

  if ($prvToPub == $recovered) {
    return $sig;
  }

  $sig['v'] = $v2;
  $recovered = ecdsa_recover($hash, $sig['v'], $sig['r'], $sig['s']);

  if ($prvToPub == $recovered) {
    return $sig;
  }

  return false;

}


function ecdsa_recover($hash, $v, $r, $s) {

  $points = Signature::recoverPublicKey_HEX($v, $r, $s, $hash);

  $pubkey = $points['x'].$points['y'];

  return $pubkey;
}


?>
