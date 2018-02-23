<?php
/*
Plugin Name: Blackjack Vending Machine
Plugin URI: https://bohendo.com
Description: 
Author: Bo Henderson <twitter.com/bohendo>
Version: 1.0
Author URI: https://bohendo.com
*/

function insert_bjvm() {
  echo "<div id='bjvm_root'><p>Hello World</p></div>";
}

add_action('admin_footer', 'insert_bjvm');

function bjvm_css() {
  echo "
  <style type='text/css'>
  #bjvm_root {
    position: absolute;
    top: 2.3em;
    margin: 0;
    padding: 0;
    right: 10px;
    font-size: 16px;
    color: #d54e21;
  }
  </style>
  ";
}

add_action('admin_head', 'bjvm_css');

?>
