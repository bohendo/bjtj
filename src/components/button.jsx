
import React from 'react';

let height = "50";
let width = "150";

export default class Button extends React.Component { 

  render() {

    ////////////////////////////////////////
    // Props & Magic Numbers

    const x = (n) => Number(this.props.x)+Number(this.props.w)*n/100;
    const y = (n) => Number(this.props.y)+Number(this.props.h)*n/100;
    const w = (n) => Number(this.props.w)*n/100;
    const h = (n) => Number(this.props.h)*n/100;

    const bg = '#ff2';
    const fg = '#ffc'

    const handle = this.props.onClick;

    let txt;
    if (this.props.type === 'deal') {
      txt = 'Deal me in';
    } else if (this.props.type === 'hit') {
      txt = 'Hit me';
    } else if (this.props.type === 'double') {
      txt = 'Double down';
    } else if (this.props.type === 'stand') {
      txt = 'Stand';
    } else if (this.props.type === 'split') {
      txt = 'Split';
    }

    let isEnabled = "0.8"
    if (this.props.moves.includes(this.props.type)) {
      isEnabled = "0.0"
    }

    return (
<g onClick={()=>this.props.fn()}>

  <rect x={x(0)} y={y(0)} width={w(100)} height={h(100)}
        rx="5" ry="5" fill={bg} stroke="black"/>
  <rect x={x(5)} y={y(10)} width={w(90)} height={h(80)}
        rx="5" ry="5" fill={fg} stroke="black"/>
  <text x={x(10)} y={y(65)} fontSize='20'>{txt}</text>

  <rect x={x(0)} y={y(0)} width={w(100)} height={h(100)}
        rx="5" ry="5" fill="black" fillOpacity={isEnabled} stroke="black"/>

</g>
    );
  }
}

