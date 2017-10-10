
import React from 'react';

export default class Payment extends React.Component { 
  render() {

    ////////////////////////////////////////
    // Props & Magic Numbers

    const x = (n) => Number(this.props.x)+Number(this.props.w)*n/100;
    const y = (n) => Number(this.props.y)+Number(this.props.h)*n/100;
    const w = (n) => Number(this.props.w)*n/100;
    const h = (n) => Number(this.props.h)*n/100;

    const fs = 18; // fs for Font Size

    return (
<g>

  <rect x={x(0)} y={y(0)} width={w(100)} height={h(100)}
        rx="5" ry="5" fill="#6f6" stroke="#000"/>

  <rect x={x(33)} y={y(10)} width={w(66)} height={h(33)}
        rx="2" ry="2" fill="#efe" stroke="#000"/>

  <text x={x(2)} y={y(38)} fontSize={fs}>
    Send Ether to:
  </text>

  <text x={x(35)} y={y(33)} fontSize={fs*0.6}>
    {this.props.address}
  </text>

  <rect x={x(33)} y={y(55)} width={w(66)} height={h(33)}
        fill="#efe" stroke="#000" contentEditable="true"/>

  <text x={x(2)} y={y(82)} fontSize={fs}>
    Receive Ether at:
  </text>

  <text x={x(35)} y={y(77)} fontSize={fs*0.6}>
    (Your wallet's address goes here)
  </text>


</g>
    );
  }
}

