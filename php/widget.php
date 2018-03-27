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
      'personal_message' => 'Enjoy this site? Support the author by playing around with the arcade game below, thanks!',
    );
    $instance = wp_parse_args( (array) $instance, $defaults);
    $personal_message = $instance['personal_message'];

    // Print settings form fields
    echo '
      <p>Personal Message:
        <textarea name="'.$this->get_field_name('personal_message').'"
           >'.$personal_message.'</textarea>
      </p>
  
    ';
  }

  function update($new_instance, $old_instance) {
    $instance = $old_instance;
    $instance['personal_message'] = sanitize_text_field($new_instance['personal_message']);
    return $instance;
  }

  function widget($args, $instance) {
    extract($args);

    echo $before_widget;
    echo '
      <h5>Blackjack Tip Jar</h5>
      <p>'.$instance['personal_message'].'</p>
      <div id="bjtj_root"></div>
    ';
    echo $after_widget;
  }
}

function bjtj_register_widget() {
  register_widget('bjtj_widget');
}

?>
