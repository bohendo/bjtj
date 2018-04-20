<?php

// do not execute this file unless it's called by WordPress while deleting this plugin
if (!defined('ABSPATH')) { exit(); }

function bjtj_uninstall() {
  delete_option('bjtj_db_version');
  delete_option('bjtj_dealer_key');
  delete_option('bjtj_event_filter');

  // I don't want to delete my custom database tables..
  // It would be bad if they were deleted accidently
}

?>
