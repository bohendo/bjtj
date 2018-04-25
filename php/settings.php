<?php


function bjtj_register_settings() {
  $provider_defaults = array(
    'type'=>'string',
    'group'=>'bjtj_settings_group',
    'description'=>'Ethereum Provider',
    'sanitize_callback'=>'esc_url',
    'show_in_rest'=>false
  );
  $address_defaults = array(
    'type'=>'string',
    'group'=>'bjtj_settings_group',
    'description'=>'Ethereum Address',
    'sanitize_callback'=>'sanitize_eth_address',
    'show_in_rest'=>false
  );
  $key_defaults = array(
    'type'=>'string',
    'group'=>'bjtj_settings_group',
    'description'=>'Ethereum Secret Key',
    'sanitize_callback'=>'sanitize_eth_key',
    'show_in_rest'=>false
  );
  register_setting('bjtj_settings_group', 'bjtj_ethprovider', $provider_defaults);
  register_setting('bjtj_settings_group', 'bjtj_dealer_address', $address_defaults);
  register_setting('bjtj_settings_group', 'bjtj_dealer_key', $key_defaults);
  register_setting('bjtj_settings_group', 'bjtj_contract_address', $address_defaults);

  $debug_defaults = array(
    'type'=>'string',
    'group'=>'bjtj_debug_group',
    'description'=>'Debug Message',
    'sanitize_callback'=>'fresh_debug',
    'show_in_rest'=>false
  );
  register_setting('bjtj_debug_group', 'bjtj_debug', $debug_defaults);
}


function sanitize_eth_key($key) {
  if (is_string($key) && strlen($key) == 64 && preg_match('/[0-9a-f]{64}/', $key)) {
    return strtolower($key);
  }
  return '';
}


function sanitize_eth_address($address) {
  if (is_string($address) && strlen($address) == 42 && preg_match('/0x[0-9a-fA-F]{40}/', $address)) {
    return strtolower($address);
  }
  return '';
}


function fresh_debug($debug) { return 'Nothing has gone wrong.. yet'; }


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

  // Get all saved options
  $ethprovider = get_option('bjtj_ethprovider');
  $contract_address = get_option('bjtj_contract_address');
  $dealer_address = get_option('bjtj_dealer_address');
  $dealer_key = get_option('bjtj_dealer_key');
  $event_filter = get_option('bjtj_event_filter');

  echo '
    <div class="wrap">
      <h1>Blackjack Tip Jar Settings</h1>
      <form method="post" action="options.php">
        '; settings_fields('bjtj_settings_group'); echo '

        <table class="form-table">

          <tr>
            <th scope="row">Ethereum Provider</th>
            <td><input type="text" size="42" name="bjtj_ethprovider" value="'.$ethprovider.'" /></td>
          </tr>
          <tr>
            <th scope="row">Provider Status</th>
            <td>'.bjtj_get_provider_status($ethprovider).'</td>
          </tr>


          <tr valign="top">
            <th scope="row">BJTJ Contract Address</th>
            <td><input type="text" size="42" name="bjtj_contract_address" value="'.$contract_address.'" /></td>
          </tr>
          <tr>
            <th scope="row">BJTJ Contract Status</th>
            <td>'.bjtj_get_contract_status($ethprovider, $contract_address).'</td>
          </tr>


          <tr valign="top">
            <th scope="row">Dealer Address</th>
            <td><input type="text" size="42" name="bjtj_dealer_address" value="'.$dealer_address.'" /></td>
          </tr>
          <tr valign="top">
            <th scope="row">Dealer Private Key</th>
            <td><input type="text" size="42" name="bjtj_dealer_key" value="'.$dealer_key.'" /></td>
          </tr>
          <tr>
            <th scope="row">Dealer Status</th>
            <td>'.bjtj_get_dealer_status($ethprovider, $contract_address, $dealer_address).'</td>
          </tr>

          <tr>
            <th scope="row">Events</th>
            <td>'.bjtj_get_event_status($ethprovider, $event_filter).'</td>
          </tr>
          <tr>
            <th scope="row">Debug</th>
            <td>'.get_option('bjtj_debug').'</td>
          </tr>

        </table>

        <p class="submit">
          <input type="submit" class="button-primary" value="Save Changes" />
        </p>

      </form>

      <form method="post" action="options.php">
        '; settings_fields('bjtj_debug_group'); echo '

        <input type="hidden" name="bjtj_debug" value="" />

        <p class="submit">
          <input type="submit" class="button-secondary" value="Reset Debug Message" />
        </p>
      </form>

    </div>
  ';

}


?>
