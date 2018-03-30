<?php

include dirname(__FILE__).'/class.php';
include dirname(__FILE__).'/sync.php';

// lor for List Of Ranks ie array('2', 'K')
function ezscore($lor) {
  $out = array();
  foreach($lor as $r) {
    $out[] = (object) array('rank'=>$r,'suit'=>'H');
  }
  return score_cards($out);
}


assert(ezscore(array('4', 'T', '5'))->n === 19);
assert(ezscore(array('?', 'K', 'A'))->n === 21);
assert(ezscore(array('?', 'K', 'A'))->bj === true);
assert(ezscore(array('A', '9'))->n === 20);
assert(ezscore(array('9', 'A'))->isSoft === true);
assert(ezscore(array('A', '9'))->isSoft === true);
assert(ezscore(array('A', '9', '3'))->n === 13);
assert(ezscore(array('A', '9', '3'))->isSoft === false);
assert(ezscore(array('Q', 'A'))->bj === true);
assert(ezscore(array('Q', '9'))->bj === false);
assert(ezscore(array('Q', '9', '2'))->n === 21);
assert(ezscore(array('Q', '9', '2'))->bj === false);
assert(ezscore(array('6', '9', '3', '10'))->n === 28);
assert(ezscore(array('A', '9', '3', '10'))->n === 23);


?>
