<?php

// FYI: widget settings have a 'widget_' prefix in wp_options

class bjtj_widget extends WP_Widget {
  function __construct() {
    $widget_ops = array(
      'classname' => 'bjtj_widget_class',
      'description' => 'Death to 3rd party ads! Long live Ethereum!',
    );
    parent::__construct('bjtj_widget', 'Blackjack Tip Jar', $widget_ops);
  }

  // settings form
  function form($instance) {
    $defaults = array(
      'address' => '0x0000000000000000000000000000000000000000',
      'provider' => 'http://localhost:8545'
    );
    $instance = wp_parse_args( (array) $instance, $defaults);
    $address = $instance['address'];
    $provider = $instance['provider'];

    // Print settings form fields
    echo '
      <p>Address:
        <input class="widefat" name="'.$this->get_field_name('address').'"
               type="text" value="'.esc_attr($address).'" />
      </p>
  
      <p>Provider:
        <input class="widefat" name="'.$this->get_field_name('provider').'"
               type="text" value="'.esc_attr($provider).'" />
      </p>

    ';
  }

  function update($new_instance, $old_instance) {
    $instance = $old_instance;
    $instance['address'] = sanitize_text_field($new_instance['address']);
    $instance['provider'] = sanitize_text_field($new_instance['provider']);
    return $instance;
  }

  function widget($args, $instance) {
    extract($args);

    echo $before_widget;
    echo '
      <h5>Blackjack Tip Jar</h5>
      <p>Enjoy this site? Support the author by playing around with the arcade game below, thanks!</p>
      <div id="bjtj_root"></div>
    ';
    echo $after_widget;
  }
}

function bjtj_register_widget() {
  register_widget('bjtj_widget');
}

?>
