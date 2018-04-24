<?php


function wei_to_meth($wei) {
  // gmp can only handle integers, floats need to be native php
  return gmp_intval(gmp_div_q($wei, gmp_pow(10,14)))/10;
}


function display_wei($wei) {
  if ($wei === false) return false;
  $meth = (string) gmp_div_q($wei, gmp_pow(10,14));
  if (strlen($meth) > 1) {
    $meth = substr_replace($meth,'.',-1,0);
  }
  if (strlen($meth) > 5) {
    $meth = substr_replace($meth,',',-5,0);
  }
  if (strlen($meth) == 1) {
    $meth = '0.'.$meth;
  }
  return $meth;
}


function meth_to_hex_wei($meth) {
  return gmp_strval(gmp_mul(intval($meth * 10), gmp_pow(10,14)), 16);
}

function is_hex($str) {
  if (preg_match('/^0x[0-9a-fA-F]+$/', $str) === 1) {
    return true;
  }
  return false;
}


?>
