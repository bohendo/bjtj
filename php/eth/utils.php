<?php


function wei_to_meth($wei) {
  $meth = (string) gmp_div_q($wei, gmp_pow(10,14));
  if (strlen($meth) > 1) {
    $meth = substr_replace($meth,'.',-1,0);
  }
  if (strlen($meth) > 5) {
    $meth = substr_replace($meth,',',-5,0);
  }
  return $meth;
}


?>
