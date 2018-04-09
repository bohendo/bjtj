<?php

include ABSPATH.'wp-content/plugins/bjtj/eth.php';

function bjtj_register_settings() {
  register_setting('bjtj_settings_group', 'bjtj_eth_provider', 'esc_url');
  register_setting('bjtj_settings_group', 'bjtj_eth_address',  'sanitize_text_field');
  register_setting('bjtj_settings_group', 'bjtj_eth_contract',  'sanitize_text_field');
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
  $bjtj_addr_balance = eth_balance($bjtj_eth_provider, $bjtj_eth_address);

  $bjtj_eth_contract = get_option('bjtj_eth_contract');
  $bjtj_dealer_balance = eth_balance($bjtj_eth_provider, $bjtj_eth_contract);

  $bjtj_dealer_bankroll = eth_bankroll($bjtj_eth_provider, $bjtj_eth_contract, $bjtj_eth_address);

  $deployedOn = eth_deployedOn($bjtj_eth_provider, $bjtj_eth_contract);

  // Get Network Status
  if (!$bjtj_eth_provider) {
    $net_status = "Please enter an ethereum provider that looks something like: http://localhost:8545";
  } else if ($bjtj_net_id !== false) {
    $net_status = "Successfully connected to network <strong>$bjtj_net_id</strong>";
  } else {
    $net_status = "Unable to connect to $bjtj_eth_provider";
  }

  // Get Address Status
  if (!$bjtj_eth_address) {
    $address_status = "Please enter an ethereum address that looks something like: 0x123456789abcdef0123456789abcdef012345678";
  } else if ($bjtj_addr_balance !== false) {
    // convert wei to milliether
    $bjtj_addr_balance = wei_to_meth($bjtj_addr_balance);
    $address_status = "Balance: <strong>$bjtj_addr_balance</strong> mETH";
  } else {
    $address_status = "Unable to connect to provider: $bjtj_eth_provider";
  }

  // Get Contract Status
  if (!$bjtj_eth_contract) {
    $contract_status = "Please enter a contract address that looks something like: 0x123456789abcdef0123456789abcdef012345678";
  } else if ($bjtj_dealer_balance !== false) {
    // convert wei to milliether
    $bjtj_dealer_balance = wei_to_meth($bjtj_dealer_balance);
    $contract_status = "Balance: <strong>$bjtj_dealer_balance</strong> mETH".', deployed on block: '.$deployedOn;
  } else {
    $contract_status = "Unable to connect to provider: $bjtj_eth_provider";
  }

  // Dealer bankroll
  if (!$bjtj_eth_address) {
    $dealer_status = "Please enter an Ethereum address to use as the dealer";
  } else if ($bjtj_dealer_bankroll !== false) {
    // convert wei to milliether
    $bjtj_dealer_bankroll = wei_to_meth($bjtj_dealer_bankroll);
    $dealer_status = "Bankroll: <strong>$bjtj_dealer_bankroll</strong> mETH";
  } else {
    $dealer_status = "Unable to connect to provider: $bjtj_eth_provider";
  }


  $bjtj_filter_id = get_option('bjtj_event_filter');
  if (!$bjtj_filter_id) {
    $bjtj_filter_id = eth_event_filter($bjtj_eth_provider, $bjtj_eth_contract, $bjtj_eth_address);
    update_option('bjtj_event_filter', $bjtj_filter_id);
  }
  update_option('bjtj_event_filter', '0x19');

  $bjtj_events = json_encode(eth_get_events($bjtj_eth_provider, $bjtj_filter_id));

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
          <tr valign="top">
            <th scope="row">BJTJ Contract Address</th>
            <td><input type="text" size="42" name="bjtj_eth_contract" value="'.$bjtj_eth_contract.'" /></td>
          </tr>
          <tr>
            <th scope="row">BJTJ Contract Balance</th>
            <td>'.$contract_status.'</td>
          </tr>
          <tr>
            <th scope="row">BJTJ Dealer Bankroll</th>
            <td>'.$dealer_status.'</td>
          </tr>
          <tr>
            <th scope="row">Event filter</th>
            <td>'.$bjtj_filter_id.'</td>
          </tr>
          <tr>
            <th scope="row">Events</th>
            <td>'.$bjtj_events.'</td>
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
