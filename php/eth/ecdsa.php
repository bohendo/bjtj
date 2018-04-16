<?php

/*

This file is derived from:
https://github.com/tuaris/CryptoCurrencyPHP/blob/master/Signature.class.php
Original Author: Daniel Morante
Contributions by: Jan Moritz Lindemann, Matyas Danter, and Joey Hewitt

ECDSA: Elliptic Curve Digital Signing Algorithm

Specs:  http://www.secg.org/sec1-v2.pdf
Domain parameters: http://www.secg.org/SEC2-Ver-1.0.pdf

## Overview

We have some universally known parameters:
 1. define an elliptic curve: y^2 = x^3 + ax + b mod p
    a & b are prefixes to determine the shape of the curve
    p is the size of the finite field (a big prime for secp256k1)
 2. define G = (x,y), a starting point somewhere on this curve.
    (Needs to have a prime order)
 3. define n, the modulo order of G (prime).
    Imagine we calculate G' = G' + G over an over starting from G' = G
    The above will eventually hit a G' == O == identity point where G + O = G.
    The order n is the number of times we can add G to itself before we hit this O
    ie the smallest number that satisfies `nG == O`
 4. define h, the cofactor aka the total number of points on the curve divided by n.
    For secp26k1, h = 1 meaning every point on the curve == xG for some x < n.
    Note that this curve is discrete rather than continuous.

## To generate a public/private key pair:
 1. We generate a random number in the range [1,n-1] to use as our private key.
 2. We can calculate a public key by doing EC-point-multiplication (ECPM) between G and our private key
    ie public key = ECPM(private-key, G)

## To create a digital signature of some message m:
 1. k = nonce generated as described by rfc6979
 2. (x1,y1) = ECPM(k, G)
 3. R = x1 mod n (assert R != 0)
 4. e = HASH(m)
 5. z = leftmost bits of e such that bitlength(z) <= (bitlength(n)
 6. S = k^-1 * (z + R * private-key) mod n (assert S != 0)
 7. Signature = (R,S)

## To recover the pubkey from a message and its signature (r,s,v):
 1. let x = r + j * n where j is in [0, h]
 2. convert x to an elliptic curve point R
  - alpha = x^3 + a*x + b mod p
  - beta = sqrt(alpha)
  - set y = beta if beta % 2 == v % 2 else set y = p - beta
  - return R = (x,y)
 3. if nR != O, try a different j
 4. e = leftmost bits of hash(message) such that bitlen(e) <= bitlen(n)
 5. Compute candidate public key Q = r^-1 (s*R - e*G)
 6. If Q is valid & matches v, return it
 7. Compute candidate public key Q = r^-1 (s*(-1)*R - e*G)
 8. If Q is valid & matches v, return it. else error

*/


// http://www.secg.org/sec1-v2.pdf#subsubsection.3.2.1
function ecdsa_pubkey($key) {
  $ec = new SECp256k1(); // ec for elliptic curve
  $pubKey = PointMathGMP::mulPoint($key, $ec->G, $ec->a, $ec->b, $ec->p);
  $pubKey['x']	= str_pad(gmp_strval($pubKey['x'], 16), 64, '0', STR_PAD_LEFT);
  $pubKey['y']	= str_pad(gmp_strval($pubKey['y'], 16), 64, '0', STR_PAD_LEFT);
  return $pubKey['x'].$pubKey['y'];
}


// http://www.secg.org/sec1-v2.pdf#subsubsection.4.1.3
function ecdsa_sign($hash, $secret) {

  // Calculate nonce k for deterministic signature
  // https://tools.ietf.org/html/rfc6979#section-3.2
  $hx = pack('H*', $secret).pack('H*', $hash);
  $v = str_pad('', 32, "\x01"); // step b
  $k = str_pad('', 32, "\x00"); // step c
  $k = hash_hmac('sha256', $v . "\x00" . $hx, $k, true); // step d
  $v = hash_hmac('sha256', $v, $k, true); // step e
  $k = hash_hmac('sha256', $v . "\x01" . $hx, $k, true); // step f
  $v = hash_hmac('sha256', $v, $k, true); // step g
  $v = hash_hmac('sha256', $v, $k, true); // step h
  // we can skip further checks because hlen = qlen = rlen = 256 bits
  $k = bin2hex($v);

  $EC = new SECp256k1(); // a, b, p, n, G

  // Calculate R
  // secg.org/sec1-v2.pdf section 4.1.2 step 1

  // http://www.secg.org/sec1-v2.pdf#subsubsection.4.1.3 step 1
  $r = PointMathGMP::mulPoint($k, $EC->G, $EC->a, $EC->b, $EC->p);
  // http://www.secg.org/sec1-v2.pdf#subsubsection.4.1.3 steps 2 & 3
  $R = str_pad(gmp_strval(gmp_mod($r['x'], $EC->n), 16), 64, '0', STR_PAD_LEFT);
  assert(gmp_cmp($r['x'], gmp_init(0)) === 1, 'wow you got amazingly unlucky');

  // hashlen == bitlen(EC->n) == 256 so we can skip step 5

  // Calculate S
  // http://www.secg.org/sec1-v2.pdf#subsubsection.4.1.3 step 6
  // S = k^-1 (hash + secret * R) mod n
  $s = gmp_mod(gmp_mul(gmp_init($secret, 16), gmp_init($R, 16)), $EC->n);
  $s = gmp_mod(gmp_add(gmp_init($hash, 16), $s), $EC->n);
  $s = gmp_mod(gmp_mul(gmp_invert(gmp_init($k, 16), $EC->n), $s), $EC->n);

  // There are two equivalent possibilities for S, we use the smaller one
  if (gmp_cmp($s, gmp_div_q($EC->n, 2)) === 1) { $s = gmp_sub($EC->n, $s); }
  $S = str_pad(gmp_strval($s, 16), 64, '0', STR_PAD_LEFT);
  assert(gmp_cmp($s, gmp_init(0)) === 1, 'wow you got amazingly unlucky');


  ////////////////////////////////////////
  // Calculate v: 35 if r['y'] is even, else 36
  // once we return, we'll add chain_id * 2 to v
  // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md

  /* Theoretically, this should work. But, in practice, it doesn't
   * The Ry parity doesn't seem linked to the pubkey parity
   * Appendix F suggests they should be linked:
   * https://ethereum.github.io/yellowpaper/paper.pdf

  $Ry = $r['y'];
  $Reven = gmp_intval(gmp_mod($Ry, 2));
  $v = 35 + $Reven;

  */ // This also works, not super efficient though

  $sig = array('v'=>35, 'r'=>$R, 's'=>$S);
  if (ecdsa_recover($hash, $sig) !== ecdsa_pubkey($secret)) {
    $sig['v'] += 1;
  }

  return $sig;
}


// http://www.secg.org/sec1-v2.pdf#subsubsection.4.1.6
function ecdsa_recover($h, $sig) {
  $EC = new SECp256k1(); // a, b, p, n, G

  // Equation (293) of:
  // https://ethereum.github.io/yellowpaper/paper.pdf#appendix.F
  $v = gmp_intval($sig['v']);
  $v = ($v === 27 || $v === 28) ? $v : 28 - ($v % 2);

  $R = gmp_init($sig['r'], 16);

  // Step 1.1: Let `x = r + j * n` for j in [0, h] and h = 1
  // We use the smaller of the two possibilities
  // so j should = 0 and x should = R

  // 1.2 & 1.3: convert x to an elliptic curve point
  // http://www.secg.org/sec1-v2.pdf#subsubsection.2.3.4 step 2.4.1

  // EC function: y^2 = x^3 + ax + b mod p
  // We have x aka R, let's calculate y squared
  $ySq = gmp_mod(gmp_add(gmp_add(gmp_pow($R, 3), gmp_mul($EC->a, $R)), $EC->b), $EC->p);

  // Get square root of above (mod p)
  // https://en.wikipedia.org/wiki/Tonelli-Shanks_algorithm
  // y = ySq ^ ((EC->p + 1) / 4)
  $y = gmp_strval( gmp_powm( $ySq, gmp_div( gmp_add($EC->p, 1), 4), $EC->p));

  // if $v == 27, then this sig came from an even Ry
  $wasEven = $v == 27 ? 1 : 0;

  // the y that we return should be even too (or vice versa)
  $isEven = 1 - gmp_intval(gmp_mod($y, 2));

  // If the parities are different, we'll use the other valid y value
  if ($isEven !== $wasEven) {
    $y = gmp_sub($EC->p, $y);
  }

  // 1.4: if nR != inf then increment j

  // 1.6.1 Compute a candidate public key Q = r^-1 (sR - eG)
  $rInv = gmp_strval(gmp_invert($R, $EC->n), 16);
  $sR = PointMathGMP::mulPoint($sig['s'], array('x' => $R, 'y' => $y), $EC->a, $EC->b, $EC->p);
  $eG = PointMathGMP::negatePoint(PointMathGMP::mulPoint($h, $EC->G, $EC->a, $EC->b, $EC->p));
  $sReG = PointMathGMP::addPoints($sR, $eG, $EC->a, $EC->p);
  $Q = PointMathGMP::mulPoint($rInv, $sReG, $EC->a, $EC->b, $EC->p);

  // Q is the derrived public key
  $pubKey['x'] = str_pad(gmp_strval($Q['x'], 16), 64, 0, STR_PAD_LEFT);
  $pubKey['y'] = str_pad(gmp_strval($Q['y'], 16), 64, 0, STR_PAD_LEFT);

  return $pubKey['x'].$pubKey['y'];
}


function test_ecdsa($hash) {
  $message = 'recover same address from a signature as from a private key';
  $sig = ecdsa_sign($hash, get_option('bjtj_dealer_key'));
  $addr1 = '0x'.substr(keccak(pack('H*',ecdsa_recover($hash, $sig))), -40);
  $addr2 = '0x'.substr(keccak(pack('H*',ecdsa_pubkey(get_option('bjtj_dealer_key')))), -40);
  if($addr1 !== $addr2) {
    $sig = json_encode($sig);
    update_option('bjtj_debug', "Assert failed: Cannot $message <br> h='$hash' <br> $addr1 != $addr2 <br> $sig");
    return false;
  }
  return true;
}

function test_suite() {

  $message = 'recover pubkey from eth-sig-util signature';

  $hash = 'e2e5aefbc7266055699f8db50688ed8ccab392c1fe4b3e990b259c59ed4eb68d';
  $ag = '0x5c2cbb43b8e5891c96ea7b1e0c96200386ffc5411ce8229b9caf6a3eab498c67247e1e49de5698706b56661fcc4d101e708e18027a565b7b600ca4efef573ee01b';
  $sig = array( 'r' => substr($ag, 0+2, 64), 's' => substr($ag, 64+2, 64), 'v' => hexdec(substr($ag, 128+2, 2)));
  $addr = '0x'.substr(keccak(pack('H*',ecdsa_recover($hash, $sig))), -40);
  $expected = '0xf17f52151ebef6c7334fad080c5704d77216b732';
  if($addr !== $expected) {
    $sig = json_encode($sig);
    update_option('bjtj_debug', "Assert failed: Cannot $message <br> $addr != $expected <br> $sig");
    return false;
  }


  $hash = '6dd22c2c664a1106a0458ae824711efd11db6569ac4dfa7f5ef7a2d28b57113e';
  if (test_ecdsa($hash) === false) return false;

  $hash = '679e0861745d710cfc07ddb896f0c27ce42c0499c341d43b7124dd6c8164c099';
  if (test_ecdsa($hash) === false) return false;

  // Everything looks good
  return true;
}


?>
