
import React from 'react';

export default class Chips extends React.Component { 
  render() {

    ////////////////////////////////////////
    // Props & Magic Numbers
    let x = Number(this.props.x);
    let y = Number(this.props.y);
    let width = 75;
    let height = 100;
    let fill = '#f66';
    let stroke = '#000'; 

    return (
<g>

  <rect x={x} y={y} width={width} height={height} rx="5" ry="5"
        fill={fill} stroke={stroke}/>
  <text x={x+7} y={y+30} font-size="25">Chips</text>
  <text x={x+25} y={y+75} font-size="30">{this.props.chips}</text>

</g>
    );
  }
}

