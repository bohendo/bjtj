
import React from 'react';

export default class Card extends React.Component {
  render() {
    return (
<g>
      <rect x={this.props.x} y={this.props.y} rx="10" ry="10"
            width={this.props.size} height={this.props.size*1.4}
            stroke="black" fill="white"/>
</g>
    );
  }
}


