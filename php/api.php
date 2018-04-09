<?php

function bjtj_register_api() {
  register_rest_route('bjtj/v1', '/move', array(
    'methods' => 'GET',
    'callback' => 'bjtj_make_move',
    'args' => array(

      'id' => array(
        'default' => '0x0',
        'validate_callback' => function($param, $request, $key) {
          return is_string($param) && strlen($param) == 42 && preg_match('/0x[0-9a-f]{40}/', $param);
        }
      ),

      'ag' => array(
        'default' => '0x0',
        'validate_callback' => function($param, $request, $key) {
          return is_string($param) && strlen($param) == 132 && preg_match('/0x[0-9a-f]{130}/', $param);
        }
      ),

      'move' => array(
        'default' => 'refresh',
        'validate_callback' => function($param, $request, $key) {
          return in_array($param, array('refresh', 'deal', 'hit', 'stand', 'double', 'split', 'cashout'));
        }
      )
    )
  ));
}

function bjtj_make_move( WP_REST_Request $request ) {
  if (bjtj_auth($request['id'], $request['ag'])) {

    // get bj game state or initalize a new one

    $id = $request['id'];

    global $wpdb;

    $table = $wpdb->prefix.'bjtj_states';

    $old_state = json_decode($wpdb->get_var(
      "SELECT state FROM $table WHERE address = '$id'"
    ));

    if ($old_state == null) {
      $old_state = new Blackjack();
      $wpdb->insert($table,
        array(
          'address' => $request['id'],
          'signature' => $request['ag'],
          'state' => json_encode($old_state),
          'modified' => current_time('mysql', 1)
        ),
        array('%s', '%s', '%s', '%s')
      );
    }

    $new_state = bjtj_bj($old_state, $request['move']);

    $wpdb->update($table,
      array(
        'state' => json_encode($new_state),
        'modified' => current_time('mysql', 1)
      ),
      array('address' => $request['id']),
      array('%s', '%s')
    );

    unset($new_state->deck);
    unset($new_state->hiddenCard);

    $new_state->contract_address = get_option('bjtj_eth_contract');
    $new_state->dealer_address = get_option('bjtj_eth_address');

    $new_state->dealer_balance = wei_to_meth(eth_bankroll(
      get_option('bjtj_eth_provider'),
      $new_state->contract_address,
      $new_state->dealer_address
    ));

    return $new_state;
  }
  return array(
    'message' => 'This isn\'t your autograph'
  );
}

?>
