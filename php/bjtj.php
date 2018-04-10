<?php
/*
Plugin Name: Blackjack Tip Jar
Plugin URI: https://bohendo.com/blackjack-tip-jar
Description: Tip me & I'll entertain you ;)
Version: 1.0
Author: Bo Henderson <twitter.com/bohendo>
Author URI: https://bohendo.com
Text Domain: bjtj
License: GPLv2
*/

$bjtj_dir = ABSPATH.'wp-content/plugins/bjtj/';

include $bjtj_dir.'include/keccak.php';
include $bjtj_dir.'include/recoverPublicKey.php';

include $bjtj_dir.'eth/index.php';
include $bjtj_dir.'install.php';
register_activation_hook(__FILE__, 'bjtj_install');

include $bjtj_dir.'widget.php';
add_action('widgets_init', 'bjtj_register_widget');

include $bjtj_dir.'status.php';
include $bjtj_dir.'settings.php';
add_action('admin_init',   'bjtj_register_settings');
add_action('admin_menu',   'bjtj_create_settings_page');

include $bjtj_dir.'bj/index.php';
include $bjtj_dir.'auth.php';
include $bjtj_dir.'api.php';
add_action('rest_api_init', 'bjtj_register_api');

function bjtj_js() {
  wp_enqueue_script('bjtj_client_bundle', '/wp-content/plugins/bjtj/js/client.bundle.js');
}
add_action('wp_footer', 'bjtj_js');


?>
