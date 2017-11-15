
import React from 'react';

export default class Chips extends React.Component { 
  render() {

    ////////////////////////////////////////
    // Props & Magic Numbers

    const x = (n) => Number(this.props.x)+Number(this.props.w)*n/100;
    const y = (n) => Number(this.props.y)+Number(this.props.h)*n/100;
    const w = (n) => Number(this.props.w)*n/100;
    const h = (n) => Number(this.props.h)*n/100;

    let bg = '#f66';
    let fg = '#faa';
    let blk = '#000'; 
    const fs = 20; // fs for Font Size

    return (
<g>

  <rect x={x(0)} y={y(0)} width={w(100)} height={h(100)}
        rx="5" ry="5" fill={bg} stroke={blk}/>

  {/* Chips */}
  <rect x={x(5)} y={y(5)} width={w(90)} height={h(40)}
        rx="5" ry="5" fill={fg} stroke={blk}/>
  <text x={x(10)} y={y(35)} fontSize={fs}>
    Chips:
  </text>
  <text x={x(60)} y={y(35)} fontSize={fs}>
    {this.props.chips}
  </text>

  {/* Bet */}
  <rect x={x(5)} y={y(55)} width={w(90)} height={h(40)}
        rx="5" ry="5" fill={fg} stroke={blk}/>
  <text x={x(10)} y={y(85)} fontSize={fs}>
    Bet per Hand:
  </text>
  <text x={x(83)} y={y(85)} fontSize={fs}>
    {this.props.bet}
  </text>

</g>
    );
  }
}

