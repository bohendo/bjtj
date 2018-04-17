<?php

function bjtj_install() {

  global $wpdb;

  update_option('bjtj_event_filter', false);
  update_option('bjtj_debug', 'Nothing has gone wrong.. yet');

  $bjtj_db_version = '1.0';
  if (get_option('bjtj_db_version') != $bjtj_db_version) {

    $q1 = 'CREATE TABLE '.$wpdb->prefix.'bjtj_states (
      address   CHAR(42)      PRIMARY KEY,
      signature CHAR(132)     NOT NULL,
      state     VARCHAR(2048) NOT NULL,
      modified  DATETIME      NOT NULL
    );';

    $q2 = 'CREATE TABLE '.$wpdb->prefix.'bjtj_payments (
      hash      CHAR(66)    PRIMARY KEY,
      sender    CHAR(42)    NOT NULL,
      recipient CHAR(42)    NOT NULL,
      value     VARCHAR(20) NOT NULL,
      paid      TINYINT     NOT NULL,
      modified  DATETIME    NOT NULL
    );';

    require_once(trailingslashit(ABSPATH) . 'wp-admin/includes/upgrade.php');

    dbDelta($q1);
    dbDelta($q2);

    // uncomment below once db schema is stable
    // update_option('bjtj_db_version', $bjtj_db_version);
  }

}

?>
