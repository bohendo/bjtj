<?php

include ABSPATH.'wp-content/plugins/bjtj/auth.php';
include ABSPATH.'wp-content/plugins/bjtj/bj/index.php';

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
    $state = bjtj_bj();

    return $state;
  }
  return array(
    'message' => 'This isn\'t your autograph'
  );
}

?>
