
import React from 'react';

let height = "50";
let width = "150";

export default class Button extends React.Component { 

  handleDeal() { console.log('deal'); }
  handleHit() { console.log('hit'); }
  handleDouble() { console.log('double'); }
  handleStand() { console.log('stand'); }

  render() {

    ////////////////////////////////////////
    // Props & Magic Numbers

    const x = (n) => Number(this.props.x)+Number(this.props.w)*n/100;
    const y = (n) => Number(this.props.y)+Number(this.props.h)*n/100;
    const w = (n) => Number(this.props.w)*n/100;
    const h = (n) => Number(this.props.h)*n/100;

    const bg = '#cc4';
    const fg = '#ffc'

    let handle
    let txt;
    if (this.props.type === 'deal') {
      handle = this.handleDeal;
      txt = 'Deal me in';
    } else if (this.props.type === 'hit') {
      handle = this.handleHit;
      txt = 'Hit me';
    } else if (this.props.type === 'double') {
      handle = this.handleDouble;
      txt = 'Double down';
    } else if (this.props.type === 'stand') {
      handle = this.handleStand;
      txt = 'Stand';
    }

    return (
<g onClick={handle}>

  <rect x={x(0)} y={y(0)} width={w(100)} height={h(100)}
        rx="5" ry="5" fill={bg} stroke="black"/>
  <rect x={x(5)} y={y(10)} width={w(90)} height={h(80)}
        rx="5" ry="5" fill={fg} stroke="black"/>
  <text x={x(10)} y={y(65)} font-size='20'>{txt}</text>

</g>
    );
  }
}

