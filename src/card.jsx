
import React from 'react';

export default class Card extends React.Component {

  renderDiamond(x, y, s) {
    let dy = Number(s * 0.18);
    let dx = Number(dy * 0.8);
    let tr_x = Number(x)+dx*1.5;
    let tr_y = Number(y)+dy*1.5;
    let bl_x = Number(x)+Number(s)-(dx*1.5);
    let bl_y = Number(y)+Number(s)*1.4-(dy*1.5);

    let tr_points = `${tr_x},${tr_y+dy} ${tr_x+dx},${tr_y}
                     ${tr_x},${tr_y-dy} ${tr_x-dx},${tr_y}`;

    let bl_points = `${bl_x},${bl_y+dy} ${bl_x+dx},${bl_y}
                     ${bl_x},${bl_y-dy} ${bl_x-dx},${bl_y}`;
    
    return (
<g>
    <polygon points={tr_points} fill="red" stroke="black"/>
    <polygon points={bl_points} fill="red" stroke="black"/>
</g>
    );
  }

  render() {
    return (
<g>
      <rect x={this.props.x} y={this.props.y} rx="10" ry="10"
            width={this.props.size} height={this.props.size*1.4}
            stroke="black" fill="white"/>

      <text x={Number(this.props.x) + Number(this.props.size)/3.5}
            y={Number(this.props.y) + Number(this.props.size)/1.05}
            font-size={this.props.size/1.5}>
        {this.props.val}
      </text>

      {this.renderDiamond(this.props.x, this.props.y,
                          this.props.size)}
</g>
    );
  }
}


