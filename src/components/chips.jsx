
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
  <rect x={x(2.5)} y={y(15)} width={w(32.5)} height={h(70)}
        rx="5" ry="5" fill={fg} stroke={blk}/>
  <text x={x(5)} y={y(62.5)} fontSize={fs}>
    Chips:
  </text>
  <text x={x(27.5)} y={y(62.5)} fontSize={fs}>
    {this.props.chips}
  </text>

  {/* Bet */}
  <rect x={x(40)} y={y(15)} width={w(57.5)} height={h(70)}
        rx="5" ry="5" fill={fg} stroke={blk}/>
  <text x={x(42.5)} y={y(62.5)} fontSize={fs}>
    Bet per Hand:
  </text>
  <text x={x(87.5)} y={y(62.5)} fontSize={fs}>
    {this.props.bet}
  </text>

</g>
    );
  }
}

