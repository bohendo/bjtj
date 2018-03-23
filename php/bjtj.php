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


include trailingslashit(ABSPATH).'wp-content/plugins/bjtj/settings.php';
add_action('admin_init',   'bjtj_register_settings');
add_action('admin_menu',   'bjtj_create_settings_page');


include trailingslashit(ABSPATH).'wp-content/plugins/bjtj/widget.php';
add_action('widgets_init', 'bjtj_register_widget');


include trailingslashit(ABSPATH).'wp-content/plugins/bjtj/install.php';
register_activation_hook(__FILE__, 'bjtj_install');


function bjtj_js() {
  wp_enqueue_script('bjtj_client_bundle', '/wp-content/plugins/bjtj/js/client.bundle.js');
}
add_action('wp_footer', 'bjtj_js');


?>
