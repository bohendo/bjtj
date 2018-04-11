<?php
/* 
 * The SECp256k1 curve
 * Fundamental ECC Function for Bitcoin/Zetacoin compatable Crypto Currency
 * @author Daniel Morante
 * Some parts may contain work based on Jan Moritz Lindemann, Matyas Danter, and Joey Hewitt
*/

class SECp256k1 {
    public $a;
    public $b;
    public $p;
    public $n;
    public $G;

    public function __construct(){
        $this->a = gmp_init('0', 10);
        $this->b = gmp_init('7', 10);
        $this->p = gmp_init('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F', 16);
        $this->n = gmp_init('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 16);

        $this->G = array('x' => gmp_init('55066263022277343669578718895168534326250603453777594175500187360389116729240'),
                         'y' => gmp_init('32670510020758816978083085130507043184471273380659243275938904335757337482424'));
    }
}


/*
 * Object orieted interface to Helpful Point Math Operations
 * Using the GMP library
 *
 * @author Daniel Morante
 * Some parts may contain work based on Jan Moritz Lindemann, Matyas Danter, and Joey Hewitt
*/

class PointMathGMP {

    /***
     * Computes the result of a point addition and returns the resulting point as an Array.
     *
     * @param Array $pt
     * @return Array Point
     * @throws \Exception
     */
    public static function doublePoint(Array $pt, $a, $p)
    {
        $gcd = gmp_strval(gmp_gcd(gmp_mod(gmp_mul(gmp_init(2, 10), $pt['y']), $p),$p));
        if($gcd != '1')
        {
            throw new \Exception('This library doesn\'t yet supports point at infinity. See https://github.com/BitcoinPHP/BitcoinECDSA.php/issues/9');
        }

        // SLOPE = (3 * ptX^2 + a )/( 2*ptY )
        // Equals (3 * ptX^2 + a ) * ( 2*ptY )^-1
        $slope = gmp_mod(
                         gmp_mul(
                                 gmp_invert(
                                            gmp_mod(
                                                    gmp_mul(
                                                            gmp_init(2, 10),
                                                            $pt['y']
                                                    ),
                                                    $p
                                            ),
                                            $p
                                 ),
                                 gmp_add(
                                         gmp_mul(
                                                 gmp_init(3, 10),
                                                 gmp_pow($pt['x'], 2)
                                         ),
                                         $a
                                 )
                         ),
                         $p
                );

        // nPtX = slope^2 - 2 * ptX
        // Equals slope^2 - ptX - ptX
        $nPt = array();
        $nPt['x'] = gmp_mod(
                            gmp_sub(
                                    gmp_sub(
                                            gmp_pow($slope, 2),
                                            $pt['x']
                                    ),
                                    $pt['x']
                            ),
                            $p
                    );

        // nPtY = slope * (ptX - nPtx) - ptY
        $nPt['y'] = gmp_mod(
                            gmp_sub(
                                    gmp_mul(
                                            $slope,
                                            gmp_sub(
                                                    $pt['x'],
                                                    $nPt['x']
                                            )
                                    ),
                                    $pt['y']
                            ),
                            $p
                    );

        return $nPt;
    }

    /***
     * Computes the result of a point addition and returns the resulting point as an Array.
     *
     * @param Array $pt1
     * @param Array $pt2
     * @return Array Point
     * @throws \Exception
     */
    public static function addPoints(Array $pt1, Array $pt2, $a, $p)
    {
        if(gmp_cmp($pt1['x'], $pt2['x']) == 0  && gmp_cmp($pt1['y'], $pt2['y']) == 0) //if identical
        {
            return self::doublePoint($pt1, $a, $p);
        }

        $gcd = gmp_strval(gmp_gcd(gmp_sub($pt1['x'], $pt2['x']), $p));
        if($gcd != '1')
        {
            throw new \Exception('This library doesn\'t yet supports point at infinity. See https://github.com/BitcoinPHP/BitcoinECDSA.php/issues/9');
        }

        // SLOPE = (pt1Y - pt2Y)/( pt1X - pt2X )
        // Equals (pt1Y - pt2Y) * ( pt1X - pt2X )^-1
        $slope      = gmp_mod(
                              gmp_mul(
                                      gmp_sub(
                                              $pt1['y'],
                                              $pt2['y']
                                      ),
                                      gmp_invert(
                                                 gmp_sub(
                                                         $pt1['x'],
                                                         $pt2['x']
                                                 ),
                                                 $p
                                      )
                              ),
                              $p
                      );

        // nPtX = slope^2 - ptX1 - ptX2
        $nPt = array();
        $nPt['x']   = gmp_mod(
                              gmp_sub(
                                      gmp_sub(
                                              gmp_pow($slope, 2),
                                              $pt1['x']
                                      ),
                                      $pt2['x']
                              ),
                              $p
                      );

        // nPtX = slope * (ptX1 - nPtX) - ptY1
        $nPt['y']   = gmp_mod(
                              gmp_sub(
                                      gmp_mul(
                                              $slope,
                                              gmp_sub(
                                                      $pt1['x'],
                                                      $nPt['x']
                                              )
                                      ),
                                      $pt1['y']
                              ),
                              $p
                      );

        return $nPt;
    }

    /***
     * Computes the result of a point multiplication and returns the resulting point as an Array.
     *
     * @param String Hex $k
     * @param Array $pG (GMP, GMP)
     * @param $base (INT)
     * @throws \Exception
     * @return Array Point (GMP, GMP)
     */
    public static function mulPoint($k, Array $pG, $a, $b, $p, $base = null)
    {
        //in order to calculate k*G
        if($base == 16 || $base == null || is_resource($base))
            $k = gmp_init($k, 16);
        if($base == 10)
            $k = gmp_init($k, 10);
        $kBin = gmp_strval($k, 2);

        $lastPoint = $pG;
        for($i = 1; $i < strlen($kBin); $i++)
        {
            if(substr($kBin, $i, 1) == 1 )
            {
                $dPt = self::doublePoint($lastPoint, $a, $p);
                $lastPoint = self::addPoints($dPt, $pG, $a, $p);
            }
            else
            {
                $lastPoint = self::doublePoint($lastPoint, $a, $p);
            }
        }
        if(!self::validatePoint(gmp_strval($lastPoint['x'], 16), gmp_strval($lastPoint['y'], 16), $a, $b, $p)){
            throw new \Exception('The resulting point is not on the curve.');
		}
        return $lastPoint;
    }

    /***
     * Calculates the square root of $a mod p and returns the 2 solutions as an array.
     *
     * @param $a
     * @return array|null
     * @throws \Exception
     */
    public static function sqrt($a, $p)
    {
        if(gmp_legendre($a, $p) != 1)
        {
            //no result
            return null;
        }

        if(gmp_strval(gmp_mod($p, gmp_init(4, 10)), 10) == 3)
        {
            $sqrt1 = gmp_powm(
                            $a,
                            gmp_div_q(
                                gmp_add($p, gmp_init(1, 10)),
                                gmp_init(4, 10)
                            ),
                            $p
                    );
            // there are always 2 results for a square root
            // In an infinite number field you have -2^2 = 2^2 = 4
            // In a finite number field you have a^2 = (p-a)^2
            $sqrt2 = gmp_mod(gmp_sub($p, $sqrt1), $p);
            return array($sqrt1, $sqrt2);
        }
        else
        {
            throw new \Exception('P % 4 != 3 , this isn\'t supported yet.');
        }
    }

    /***
     * Calculate the Y coordinates for a given X coordinate.
     *
     * @param $x
     * @param null $derEvenOrOddCode
     * @return array|null|String
     */
    public static function calculateYWithX($x, $a, $b, $p, $derEvenOrOddCode = null)
    {
        $x  = gmp_init($x, 16);
        $y2 = gmp_mod(
                      gmp_add(
                              gmp_add(
                                      gmp_powm($x, gmp_init(3, 10), $p),
                                      gmp_mul($a, $x)
                              ),
                              $b
                      ),
                      $p
              );

        $y = self::sqrt($y2, $p);

        if(!$y) //if there is no result
        {
            return null;
        }

        if(!$derEvenOrOddCode)
        {
            return $y;
        }

        else if($derEvenOrOddCode == '02') // even
        {
            $resY = null;
            if(false == gmp_strval(gmp_mod($y[0], gmp_init(2, 10)), 10))
                $resY = gmp_strval($y[0], 16);
            if(false == gmp_strval(gmp_mod($y[1], gmp_init(2, 10)), 10))
                $resY = gmp_strval($y[1], 16);
            if($resY)
            {
                while(strlen($resY) < 64)
                {
                    $resY = '0' . $resY;
                }
            }
            return $resY;
        }
        else if($derEvenOrOddCode == '03') // odd
        {
            $resY = null;
            if(true == gmp_strval(gmp_mod($y[0], gmp_init(2, 10)), 10))
                $resY = gmp_strval($y[0], 16);
            if(true == gmp_strval(gmp_mod($y[1], gmp_init(2, 10)), 10))
                $resY = gmp_strval($y[1], 16);
            if($resY)
            {
                while(strlen($resY) < 64)
                {
                    $resY = '0' . $resY;
                }
            }
            return $resY;
        }

        return null;
    }

    /***
     * Returns true if the point is on the curve and false if it isn't.
     *
     * @param $x
     * @param $y
     * @return bool
     */
    public static function validatePoint($x, $y, $a, $b, $p)
    {
        $x  = gmp_init($x, 16);
        $y2 = gmp_mod(
                        gmp_add(
                            gmp_add(
                                gmp_powm($x, gmp_init(3, 10), $p),
                                gmp_mul($a, $x)
                            ),
                            $b
                        ),
                        $p
                    );
        $y = gmp_mod(gmp_pow(gmp_init($y, 16), 2), $p);

        if(gmp_cmp($y2, $y) == 0)
            return true;
        else
            return false;
    }

    /***
     * Returns Negated Point (Y).
     *
     * @param $point Array(GMP, GMP)
     * @return Array(GMP, GMP)
     */
	public static function negatePoint($point) { 
		return array('x' => $point['x'], 'y' => gmp_neg($point['y'])); 
	}

	// These 2 function don't really belong here.

	// Checks is the given number (DEC String) is even
	public static function isEvenNumber($number) {
		return (((int)$number[strlen($number)-1]) & 1) == 0;
	}
	// Converts BIN to GMP
	public static function bin2gmp($binStr) {
		$v = gmp_init('0');

		for ($i = 0; $i < strlen($binStr); $i++) {
			$v = gmp_add(gmp_mul($v, 256), ord($binStr[$i]));
		}

		return $v;
	}

}


/* 
 * Private Key
 * For Bitcoin/Zetacoin compatable Crypto Currency utilizing the secp256k1 curve
 * @author Daniel Morante
 * Some parts may contain work based on Jan Moritz Lindemann, Matyas Danter, and Joey Hewitt
*/

 class PrivateKey{
 
    public $k;

    public function __construct($private_key = null){
		if (empty($private_key)){
			$this->generateRandomPrivateKey();
		}
		else{
			$this->setPrivateKey($private_key);
		}
    }

    /***
     * Generate a new random private key.
     * The extra parameter can be some random data typed down by the user or mouse movements to add randomness.
     *
     * @param string $extra
     * @throws \Exception
     */
    public function generateRandomPrivateKey($extra = 'FSQF5356dsdsqdfEFEQ3fq4q6dq4s5d')
    {
		$secp256k1 = new SECp256k1();
		$n = $secp256k1->n;

        //private key has to be passed as an hexadecimal number
        do { //generate a new random private key until to find one that is valid
            $bytes      = openssl_random_pseudo_bytes(256, $cStrong);
            $hex        = bin2hex($bytes);
            $random     = $hex . microtime(true).rand(100000000000, 1000000000000) . $extra;
            $this->k    = hash('sha256', $random);

            if(!$cStrong)
            {
                throw new \Exception('Your system is not able to generate strong enough random numbers');
            }

        } while(gmp_cmp(gmp_init($this->k, 16), gmp_sub($n, gmp_init(1, 10))) == 1);
    }

    /***
     * return the private key.
     *
     * @return String Hex
     */
    public function getPrivateKey()
    {
        return $this->k;
    }

    /***
     * set a private key.
     *
     * @param String Hex $k
     * @throws \Exception
     */
    public function setPrivateKey($k)
    {
		$secp256k1 = new SECp256k1();
		$n = $secp256k1->n;
        
        //private key has to be passed as an hexadecimal number
        if(gmp_cmp(gmp_init($k, 16), gmp_sub($n, gmp_init(1, 10))) == 1)
        {
            throw new \Exception('Private Key is not in the 1,n-1 range');
        }
        $this->k = $k;
    }

    /***
     * returns the X and Y point coordinates of the public key.
     *
     * @return Array Point
     * @throws \Exception
     */
    public function getPubKeyPoints()
    {
        $secp256k1 = new SECp256k1();
        $G = $secp256k1->G;
        $a = $secp256k1->a;
        $b = $secp256k1->b;
        $p = $secp256k1->p;
        $k = $this->k;

        if(!isset($this->k))
        {
            throw new \Exception('No Private Key was defined');
        }

        $pubKey 	    = PointMathGMP::mulPoint($k,
                                          array('x' => $G['x'], 'y' => $G['y']),
										  $a,
										  $b,
										  $p
                                 );

        $pubKey['x']	= gmp_strval($pubKey['x'], 16);
        $pubKey['y']	= gmp_strval($pubKey['y'], 16);

        while(strlen($pubKey['x']) < 64)
        {
            $pubKey['x'] = '0' . $pubKey['x'];
        }

        while(strlen($pubKey['y']) < 64)
        {
            $pubKey['y'] = '0' . $pubKey['y'];
        }

        return $pubKey;
    }

 }


/* 
 * Crypto Currency Message Signing and Verification
 * For Bitcoin/Zetacoin compatable Crypto Currency utilizing the secp256k1 curve
 * @author Daniel Morante
 * Some parts may contain work based on Jan Moritz Lindemann, Matyas Danter, and Joey Hewitt
*/

class Signature {

    /***
     * Sign a hash with the private key that was set and returns signatures as an array (R,S)
     *
     * @param $hash
     * @param $k
     * @param null $nonce
     * @throws \Exception
     * @return Array
     */
    public static function getSignatureHashPoints($hash, $k, $nonce = null)
    {
		$secp256k1 = new SECp256k1();
		$a = $secp256k1->a;
		$b = $secp256k1->b;
		$G = $secp256k1->G;
		$n = $secp256k1->n;
		$p = $secp256k1->p;

        if(empty($k))
        {
            throw new \Exception('No Private Key was defined');
        }

        if(null == $nonce)
        {
            $random     = openssl_random_pseudo_bytes(256, $cStrong);
            $random     = $random . microtime(true).rand(100000000000, 1000000000000);
            $nonce      = gmp_strval(gmp_mod(gmp_init(hash('sha256',$random), 16), $n), 16);
        }

        //first part of the signature (R).

        $rPt = PointMathGMP::mulPoint($nonce, $G, $a, $b, $p);
        $R	= gmp_strval($rPt ['x'], 16);

        while(strlen($R) < 64)
        {
            $R = '0' . $R;
        }

        //second part of the signature (S).
        //S = nonce^-1 (hash + privKey * R) mod p

        $S = gmp_strval(
                        gmp_mod(
                                gmp_mul(
                                        gmp_invert(
                                                   gmp_init($nonce, 16),
                                                   $n
                                        ),
                                        gmp_add(
                                                gmp_init($hash, 16),
                                                gmp_mul(
                                                        gmp_init($k, 16),
                                                        gmp_init($R, 16)
                                                )
                                        )
                                ),
                                $n
                        ),
                        16
             );

        if(strlen($S)%2)
        {
            $S = '0' . $S;
        }

        if(strlen($R)%2)
        {
            $R = '0' . $R;
        }

        return array('R' => $R, 'S' => $S);
    }

    /***
     * Sign a hash with the private key that was set and returns a DER encoded signature
     *
     * @param $hash
     * @param null $nonce
     * @return string
     */
    public static function signHash($hash, $k, $nonce = null)
    {
        $points = self::getSignatureHashPoints($hash, $k, $nonce);

        $signature = '02' . dechex(strlen(hex2bin($points['R']))) . $points['R'] . '02' . dechex(strlen(hex2bin($points['S']))) . $points['S'];
        $signature = '30' . dechex(strlen(hex2bin($signature))) . $signature;

        return $signature;
    }



    /***
     * extract the public key from the signature and using the recovery flag.
     * see http://crypto.stackexchange.com/a/18106/10927
     * based on https://github.com/brainwallet/brainwallet.github.io/blob/master/js/bitcoinsig.js
     * possible public keys are r−1(sR−zG) and r−1(sR′−zG)
     * Recovery flag rules are :
     * binary number between 28 and 35 inclusive
     * if the flag is > 30 then the address is compressed.
     *
     * @param $flag (INT)
     * @param $R (HEX String)
     * @param $S (HEX String)
     * @param $hash (HEX String)
     * @return array
     */
    public static function getPubKeyWithRS($flag, $R, $S, $hash)
    {
		$secp256k1 = new SECp256k1();
		$a = $secp256k1->a;
		$b = $secp256k1->b;
		$G = $secp256k1->G;
		$n = $secp256k1->n;
		$p = $secp256k1->p;

        $isCompressed = false;

        if ($flag < 27 || $flag >= 35) {
            return false;
		}

        if($flag >= 31) //if address is compressed
        {
            $isCompressed = true;
            $flag -= 4;
        }

        $recid = $flag - 27;

        //step 1.1
        $x = null;
        $x = gmp_add(
                     gmp_init($R, 16),
                     gmp_mul(
                             $n,
                             gmp_div_q( //check if j is equal to 0 or to 1.
                                        gmp_init($recid, 10),
                                        gmp_init(2, 10)
                             )
                     )
             );

        //step 1.3
        $y = null;
        if(1 == $flag % 2) //check if y is even.
        {

            $gmpY = PointMathGMP::calculateYWithX(gmp_strval($x, 16), $a, $b, $p, '02');

            if(null != $gmpY)

                $y = gmp_init($gmpY, 16);

        }
        else
        {

            $gmpY = PointMathGMP::calculateYWithX(gmp_strval($x, 16), $a, $b, $p, '03');
            if(null != $gmpY)
                $y = gmp_init($gmpY, 16);
        }


        if(null == $y)
            return null;

        $Rpt = array('x' => $x, 'y' => $y);

        //step 1.6.1
        //calculate r^-1 (S*Rpt - eG)

        $eG = PointMathGMP::mulPoint($hash, $G, $a, $b, $p);

		$Rinv = gmp_strval(gmp_invert(gmp_init($R, 16), $n), 16);

		// Possible issue
        $eG['y'] = gmp_mod(gmp_neg($eG['y']), $p);
		// Possible Fix
		//$eG['y'] = gmp_neg($eG['y']);

        $SR = PointMathGMP::mulPoint($S, $Rpt, $a, $b, $p);

		$sR_plus_eGNeg = PointMathGMP::addPoints($SR, $eG, $a, $p);

        $pubKey = PointMathGMP::mulPoint(
                            $Rinv,
                            $sR_plus_eGNeg,
							$a, 
							$b, 
							$p
                  );

        $pubKey['x'] = gmp_strval($pubKey['x'], 16);
        $pubKey['y'] = gmp_strval($pubKey['y'], 16);

        while(strlen($pubKey['x']) < 64)
            $pubKey['x'] = '0' . $pubKey['x'];

        while(strlen($pubKey['y']) < 64)
            $pubKey['y'] = '0' . $pubKey['y'];

		if($isCompressed){
			$derPubKey = AddressCodec::Compress($pubKey);
		}
		else{
			$derPubKey = AddressCodec::Hex($pubKey);
		}

        if(self::checkSignaturePoints($derPubKey, $R, $S, $hash)){
            return $derPubKey;
		}
        else{
            return false;
		}

    }

	// Same as Below but accepts HEX strings
	public static function recoverPublicKey_HEX($flag, $R, $S, $hash){
		return self::recoverPublicKey(gmp_init($R,16), gmp_init($S,16), gmp_init($hash,16), $flag);
	}

	// $R, $S, and $hash are GMP
	// $recoveryFlags is INT
	public static function recoverPublicKey($R, $S, $hash, $recoveryFlags){
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

		// Precalculate (p + 1) / 4 where p is the field order
		// $p_over_four is GMP
		static $p_over_four; // XXX just assuming only one curve/prime will be used
		if ($p_over_four == null) {
			$p_over_four = gmp_div(gmp_add($p, 1), 4);
		}

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

		return $pubKey;
	}

    /***
     * Check signature with public key R & S values of the signature and the message hash.
     *
     * @param $pubKey
     * @param $R
     * @param $S
     * @param $hash
     * @return bool
     */
    public static function checkSignaturePoints($pubKey, $R, $S, $hash)
    {
        $secp256k1 = new SECp256k1();
		$a = $secp256k1->a;
		$b = $secp256k1->b;
		$G = $secp256k1->G;
		$n = $secp256k1->n;
		$p = $secp256k1->p;

        $pubKeyPts = AddressCodec::Decompress($pubKey);

        // S^-1* hash * G + S^-1 * R * Qa

        // S^-1* hash
        $exp1 =  gmp_strval(
                            gmp_mul(
                                    gmp_invert(
                                               gmp_init($S, 16),
                                               $n
                                    ),
                                    gmp_init($hash, 16)
                            ),
                            16
                 );

        // S^-1* hash * G
        $exp1Pt = PointMathGMP::mulPoint($exp1, $G, $a, $b, $p);


        // S^-1 * R
        $exp2 =  gmp_strval(
                            gmp_mul(
                                    gmp_invert(
                                               gmp_init($S, 16),
                                                $n
                                    ),
                                    gmp_init($R, 16)
                            ),
                            16
                 );
        // S^-1 * R * Qa

        $pubKeyPts['x'] = gmp_init($pubKeyPts['x'], 16);
        $pubKeyPts['y'] = gmp_init($pubKeyPts['y'], 16);

        $exp2Pt = PointMathGMP::mulPoint($exp2, $pubKeyPts, $a, $b, $p);
        $resultingPt = PointMathGMP::addPoints($exp1Pt, $exp2Pt, $a, $p);

        $xRes = gmp_strval($resultingPt['x'], 16);

        while(strlen($xRes) < 64)
            $xRes = '0' . $xRes;

        if($xRes == $R)
            return true;
        else
            return false;
    }

    /***
     * checkSignaturePoints wrapper for DER signatures
     *
     * @param $pubKey
     * @param $signature
     * @param $hash
     * @return bool
     */
    public static function checkDerSignature($pubKey, $signature, $hash)
    {
        $signature = hex2bin($signature);
        if('30' != bin2hex(substr($signature, 0, 1)))
            return false;

        $RLength = hexdec(bin2hex(substr($signature, 3, 1)));
        $R = bin2hex(substr($signature, 4, $RLength));

        $SLength = hexdec(bin2hex(substr($signature, $RLength + 5, 1)));
        $S = bin2hex(substr($signature, $RLength + 6, $SLength));

        //echo "\n\nsignature:\n";
        //print_r(bin2hex($signature));

        //echo "\n\nR:\n";
        //print_r($R);
        //echo "\n\nS:\n";
        //print_r($S);

        return self::checkSignaturePoints($pubKey, $R, $S, $hash);
    }

}

?>
