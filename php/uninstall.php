<?php

// do not execute this file unless it's called while deleting this plugin
if (!defined('ABSPATH') || !defined('WP_UNINSTALL_PLUGIN')) {
  exit();
}

delete_option('bjtj_eth_provider');
delete_option('bjtj_eth_address');
delete_option('bjtj_db_version');

// I don't want to delete my custom database tables
// It would be bad if they were deleted accidently

?>
