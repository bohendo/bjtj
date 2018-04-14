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
  $ec = new SECp256k1(); // ec for elliptic curve
  $pubKey = PointMathGMP::mulPoint($key, $ec->G, $ec->a, $ec->b, $ec->p);
  $pubKey['x']	= str_pad(gmp_strval($pubKey['x'], 16), 64, '0', STR_PAD_LEFT);
  $pubKey['y']	= str_pad(gmp_strval($pubKey['y'], 16), 64, '0', STR_PAD_LEFT);
  return $pubKey['x'].$pubKey['y'];
}


function ecdsa_sign($hash, $key) {
  $ec = new SECp256k1();

  // Calculate nonce for deterministic signature
  // https://tools.ietf.org/html/rfc6979#section-3.2
  $hx = pack('H*', $key).pack('H*', $hash); 
  $v = str_pad('', 32, "\x01"); // step b
  $k = str_pad('', 32, "\x00"); // step c
  $k = hash_hmac('sha256', $v . "\x00" . $hx, $k, true); // step d
  $v = hash_hmac('sha256', $v, $k, true); // step e
  $k = hash_hmac('sha256', $v . "\x01" . $hx, $k, true); // step f
  $v = hash_hmac('sha256', $v, $k, true); // step g
  $v = hash_hmac('sha256', $v, $k, true); // step h
  $nonce = bin2hex($v);

  // Calculate R
  $r = PointMathGMP::mulPoint($nonce, $ec->G, $ec->a, $ec->b, $ec->p);
  $R = str_pad(gmp_strval($r['x'], 16), 64, '0', STR_PAD_LEFT);
  assert(gmp_cmp($r['x'], gmp_init(0)) === 1, 'wow you got really unlucky');

  // Calculate S
  $s = gmp_mul(gmp_init($key, 16), gmp_init($R, 16));
  $s = gmp_mod(gmp_add(gmp_init($hash, 16), $s), $ec->n);
  $s = gmp_mod(gmp_mul($s, gmp_invert(gmp_init($nonce, 16), $ec->n)), $ec->n);
  if (gmp_cmp($s, gmp_div_q($ec->n, 2)) === 1) { $s = gmp_sub($ec->n, $s); }
  $S = str_pad(gmp_strval($s, 16), 64, '0', STR_PAD_LEFT);
  assert(gmp_cmp($s, gmp_init(0)) === 1, 'wow you got really unlucky');

  // Calculate V
  $v = 35;
  $v += gmp_intval(gmp_mod($r['y'], 2));

  return array('v'=>$v, 'r'=>$R, 's'=>$S);
}



// http://www.secg.org/sec1-v2.pdf
// See SEC 1 v 2.0 Section 4.1.6
function ecdsa_recover($h, $sig) {
  $ec = new SECp256k1();

  $R = gmp_init($sig['r'], 16);

  // 1.3 Convert x to point
  $alpha = gmp_mod(gmp_add(gmp_add(gmp_pow($R, 3), gmp_mul($ec->a, $R)), $ec->b), $ec->p);
  $beta = gmp_strval(gmp_powm($alpha, gmp_div(gmp_add($ec->p, 1), 4), $ec->p));

  $evenY = 1 - $sig['v'] % 2;
  $evenB = 1 - gmp_intval(gmp_mod($beta, 2));

  // If beta is even, but y isn't or vice versa, then convert it, otherwise we're done and y == beta.
  if ($evenY === $evenB) { $y = gmp_sub($ec->p, $beta); } else { $y = gmp_init($beta); }

  // 1.6.1 Compute a candidate public key Q = r^-1 (sR - eG)
  $rInv = gmp_strval(gmp_invert($R, $ec->n), 16);

  $eGNeg = PointMathGMP::negatePoint(PointMathGMP::mulPoint($h, $ec->G, $ec->a, $ec->b, $ec->p));

  $sR = PointMathGMP::mulPoint($sig['s'], array('x' => $R, 'y' => $y), $ec->a, $ec->b, $ec->p);
  $sR_plus_eGNeg = PointMathGMP::addPoints($sR, $eGNeg, $ec->a, $ec->p);

  $Q = PointMathGMP::mulPoint($rInv, $sR_plus_eGNeg, $ec->a, $ec->b, $ec->p);

  // Q is the derrived public key
  $pubKey['x'] = str_pad(gmp_strval($Q['x'], 16), 64, 0, STR_PAD_LEFT);
  $pubKey['y'] = str_pad(gmp_strval($Q['y'], 16), 64, 0, STR_PAD_LEFT);

  return $pubKey['x'].$pubKey['y'];
}


?>
