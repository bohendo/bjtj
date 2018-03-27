<?php

function bjtj_register_api() {
  register_rest_route('bjtj/v1', '/move', array(
    'methods' => 'GET',
    'callback' => 'bjtj_make_move',
    'args' => array(
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
  if (bjtj_auth($request)) {
    return array(
      'message' => 'Received move '.$request['move']
    );
  }
  return array(
    'message' => 'Please sign the cookie first'
  );
}

function bjtj_auth( WP_REST_Request $request ) {

  return false;
}

?>
