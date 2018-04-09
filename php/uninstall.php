<?php

// do not execute this file unless it's called by WordPress while deleting this plugin
if (!defined('ABSPATH') || !defined('WP_UNINSTALL_PLUGIN')) {
  exit();
}

delete_option('bjtj_db_version');
delete_option('bjtj_ethprovider');
delete_option('bjtj_contract_address');
delete_option('bjtj_dealer_address');
delete_option('bjtj_event_filter');

// I don't want to delete my custom database tables..
// It would be bad if they were deleted accidently

?>
