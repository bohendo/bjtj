<?php

include trailingslashit(ABSPATH).'wp-content/plugins/bjtj/eth.php';

function bjtj_register_settings() {
  register_setting('bjtj_settings_group', 'bjtj_eth_provider', 'esc_url');
  register_setting('bjtj_settings_group', 'bjtj_eth_address',  'sanitize_text_field');
}


function bjtj_create_settings_page() {
  add_options_page(
    'Blackjack Tip Jar Settings',
    'Blackjack Tip Jar',
    'manage_options',
    'bjtj_settings_menu',
    'bjtj_render_settings'
  );
}


function bjtj_render_settings() {

  $bjtj_eth_provider = get_option('bjtj_eth_provider');
  $bjtj_net_id = eth_net_id($bjtj_eth_provider);

  $bjtj_eth_address = get_option('bjtj_eth_address');
  $bjtj_balance = eth_balance($bjtj_eth_provider, $bjtj_eth_address);


  // Get Network Status
  if (!$bjtj_eth_provider) {
    $net_status = "Please enter an ethereum provider that looks something like: http://localhost:8545";
  } else if ($bjtj_net_id) {
    $net_status = "Successfully connected to network $bjtj_net_id";
  } else {
    $net_status = "Unable to connect to $bjtj_eth_provider";
  }

  // Get Address Status
  if (!$bjtj_eth_address) {
    $address_status = "Please enter an ethereum address that looks something like: 0x123456789abcdef0123456789abcdef012345678";
  } else if ($bjtj_balance) {
    $address_status = "Balance: $bjtj_balance";
  } else {
    $address_status = "Unable to connect to $bjtj_eth_provider";
  }


  echo '
    <div class="wrap">
      <h1>Blackjack Tip Jar Settings</h1>
      <form method="post" action="options.php">

  ';
  settings_fields('bjtj_settings_group');
  echo '

        <table class="form-table">
          <tr>
            <th scope="row">Ethereum Provider</th>
            <td><input type="text" size="42" name="bjtj_eth_provider" value="'.$bjtj_eth_provider.'" /></td>
          </tr>
          <tr>
            <th scope="row">Provider Status</th>
            <td>'.$net_status.'</td>
          </tr>
          <tr valign="top">
            <th scope="row">Ethereum Address</th>
            <td><input type="text" size="42" name="bjtj_eth_address" value="'.$bjtj_eth_address.'" /></td>
          </tr>
          <tr>
            <th scope="row">Address Status</th>
            <td>'.$address_status.'</td>
          </tr>
        </table>

        <p class="submit">
          <input type="submit" class="button-primary" value="Save Changes" />
        </p>

      </form>
    </div>
  ';

}

?>
