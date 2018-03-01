
import React from 'react';

let height = "50";
let width = "150";

export default class Ctrls extends React.Component { 
  render() {

    const { type, moves, submit } = this.props

    ////////////////////////////////////////
    // Props & Magic Numbers

    const x = (n) => Number(this.props.x)+Number(this.props.w)*n/100;
    const y = (n) => Number(this.props.y)+Number(this.props.h)*n/100;
    const w = (n) => Number(this.props.w)*n/100;
    const h = (n) => Number(this.props.h)*n/100;

    const bg = '#ff2';
    const fg = '#ffc'

    let isEnabled = "0.8"
    if (moves.includes(type)) {
      isEnabled = "0.0"
    }

    // TODO: Add hit,stand,double,split buttons
    return (


<g onClick={()=>submit('deal')}>

  <rect x={x(0)} y={y(0)} width={w(100)} height={h(100)}
        rx="5" ry="5" fill={bg} stroke="black"/>

  <rect x={x(5)} y={y(10)} width={w(90)} height={h(80)}
        rx="5" ry="5" fill={fg} stroke="black"/>

  <text x={x(10)} y={y(65)} fontSize='20' pointerEvents="none">Deal</text>

  <rect x={x(0)} y={y(0)} width={w(100)} height={h(100)}
        rx="5" ry="5" fill="black" fillOpacity={isEnabled} stroke="black"/>

</g>
    );
  }
}

