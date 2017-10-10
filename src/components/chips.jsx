
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
    const fs = 23; // fs for Font Size

    return (
<g>

  <rect x={x(0)} y={y(0)} width={w(100)} height={h(100)}
        rx="5" ry="5" fill={bg} stroke={blk}/>

  {/* Chips */}
  <rect x={x(5)} y={y(3)} width={w(90)} height={h(25)}
        rx="5" ry="5" fill={fg} stroke={blk}/>
  <text x={x(20)} y={y(20)} fontSize={fs}>
    Chips
  </text>
  <text x={x(43)} y={y(45)} fontSize={fs}>
    {this.props.chips}
  </text>

  {/* Bet */}
  <rect x={x(5)} y={y(50)} width={w(90)} height={h(25)}
        rx="5" ry="5" fill={fg} stroke={blk}/>
  <text x={x(35)} y={y(68)} fontSize={fs}>
    Bet
  </text>
  <text x={x(43)} y={y(91)} fontSize={fs}>
    {this.props.bet}
  </text>

  <text x={x(20)} y={y(91)} fontSize={fs}>-</text>

  <text x={x(70)} y={y(91)} fontSize={fs}>+</text>

</g>
    );
  }
}

