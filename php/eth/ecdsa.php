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

  // https://tools.ietf.org/html/rfc6979#section-3.2
  // deterministic nonce generation can be drastically simplified
  // because qlen/rlen/hlen are all 256 bits
  $hx = pack('H*', $key).pack('H*', $hash); 
  $v = str_pad('', 32, "\x01"); // step b
  $k = str_pad('', 32, "\x00"); // step c
  $k = hash_hmac('sha256', $v . "\x00" . $hx, $k, true); // step d
  $v = hash_hmac('sha256', $v, $k, true); // step e
  $k = hash_hmac('sha256', $v . "\x01" . $hx, $k, true); // step f
  $v = hash_hmac('sha256', $v, $k, true); // step g
  $v = hash_hmac('sha256', $v, $k, true); // step h
  $nonce = bin2hex($v);

  $ec = new SECp256k1();

  // Calculate R
  $r = PointMathGMP::mulPoint($nonce, $ec->G, $ec->a, $ec->b, $ec->p);
  $R = str_pad(gmp_strval($r['x'], 16), 64, '0', STR_PAD_LEFT);

  // Calculate S
  $s = gmp_mul(gmp_init($key, 16), gmp_init($R, 16));
  $s = gmp_mod(gmp_add(gmp_init($hash, 16), $s), $ec->n);
  $s = gmp_mod(gmp_mul($s, gmp_invert(gmp_init($nonce, 16), $ec->n)), $ec->n);
  if (gmp_cmp($s, gmp_div_q($ec->n, 2)) === 1) { $s = gmp_sub($ec->n, $s); }
  $S = str_pad(gmp_strval($s, 16), 64, '0', STR_PAD_LEFT);

  // Calculate V
  $v = 27;
  $v += gmp_intval(gmp_mod($r['y'], 2));

  $sig = array(
    'v'=>$v,
    'r'=>$R,
    's'=>$S
  );

  return $sig;

}


function ecdsa_recover($h, $v, $r, $s) {

  $R = gmp_init($r,16);
  $S = gmp_init($s,16);
  $hash = gmp_init($h,16);
  $recoveryFlags = $v;

		$secp256k1 = new SECp256k1();
		$a = $secp256k1->a;
		$b = $secp256k1->b;
		$G = $secp256k1->G;
		$n = $secp256k1->n;
		$p = $secp256k1->p;

		$isYEven = ($recoveryFlags & 1) != 0;
		$isSecondKey = ($recoveryFlags & 2) != 0;

		// PointMathGMP::mulPoint wants HEX String
		$e = gmp_strval($hash, 16);
		$s = gmp_strval($S, 16);

    $p_over_four = gmp_div(gmp_add($p, 1), 4);

		// 1.1 Compute x
		// $x is GMP
		if (!$isSecondKey) {
			$x = $R;
		} else {
			$x = gmp_add($R, $n);
		}

		// 1.3 Convert x to point
		// $alpha is GMP
		$alpha = gmp_mod(gmp_add(gmp_add(gmp_pow($x, 3), gmp_mul($a, $x)), $b), $p);
		// $beta is DEC String (INT)
		$beta = gmp_strval(gmp_powm($alpha, $p_over_four, $p));

		// If beta is even, but y isn't or vice versa, then convert it,
		// otherwise we're done and y == beta.
		if (PointMathGMP::isEvenNumber($beta) == $isYEven) {
			// gmp_sub function will convert the DEC String "$beta" into a GMP
			// $y is a GMP 
			$y = gmp_sub($p, $beta);
		} else {
			// $y is a GMP
			$y = gmp_init($beta);
		}

		// 1.4 Check that nR is at infinity (implicitly done in construtor) -- Not reallly
		// $Rpt is Array(GMP, GMP)
		$Rpt = array('x' => $x, 'y' => $y);

		// 1.6.1 Compute a candidate public key Q = r^-1 (sR - eG)
		// $rInv is a HEX String
		$rInv = gmp_strval(gmp_invert($R, $n), 16);

		// $eGNeg is Array (GMP, GMP)
		$eGNeg = PointMathGMP::negatePoint(PointMathGMP::mulPoint($e, $G, $a, $b, $p));

		$sR = PointMathGMP::mulPoint($s, $Rpt, $a, $b, $p);

		$sR_plus_eGNeg = PointMathGMP::addPoints($sR, $eGNeg, $a, $p);

		// $Q is Array (GMP, GMP)
		$Q = PointMathGMP::mulPoint($rInv, $sR_plus_eGNeg, $a, $b, $p);

		// Q is the derrived public key
		// $pubkey is Array (HEX String, HEX String)
		// Ensure it's always 64 HEX Charaters
    $pubKey['x'] = str_pad(gmp_strval($Q['x'], 16), 64, 0, STR_PAD_LEFT);
    $pubKey['y'] = str_pad(gmp_strval($Q['y'], 16), 64, 0, STR_PAD_LEFT);


  return $pubKey['x'].$pubKey['y'];
}


?>
