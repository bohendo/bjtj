<?php

function bjtj_install() {

  global $wpdb;

  $bjtj_db_version = '1.0';
  if (get_option('bjtj_db_version') != $bjtj_db_version) {

    $states_table = $wpdb->prefix.'bjtj_states';
    $q1 = 'CREATE TABLE '.$states_table.' (
      address   CHAR(42)      PRIMARY KEY,
      signature CHAR(132)     NOT NULL,
      state     VARCHAR(2048) NOT NULL,
      modified  DATETIME      NOT NULL
    );';

    $payments_table = $wpdb->prefix.'bjtj_payments';
    $q2 = 'CREATE TABLE '.$payments_table.' (
      hash      CHAR(66) PRIMARY KEY,
      sender    CHAR(42) NOT NULL,
      recipient CHAR(42) NOT NULL,
      value     BIGINT   NOT NULL,
      paid      TINYINT  NOT NULL,
      modified  DATETIME NOT NULL
    );';

    require_once(trailingslashit(ABSPATH) . 'wp-admin/includes/upgrade.php');

    dbDelta($q1);
    dbDelta($q2);

    update_option('bjtj_db_version', $bjtj_db_version);
  }

}

?>
