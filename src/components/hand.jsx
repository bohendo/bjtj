
import React from 'react';
import Card from './card.jsx';

export default class Hand extends React.Component { 
  render() {

    ////////////////////////////////////////
    // Props & Magic Numbers

    const x = (n) => Number(this.props.x) +
                     Number(this.props.w)*n/100;
    const y = (n) => Number(this.props.y) +
                     Number(this.props.w*0.8)*n/100;
    const w = (n) => Number(this.props.w)*n/100;

    const suits = this.props.hand.map((h)=>h.cards.map(c=>c.suit))
    const ranks = this.props.hand.map((h)=>h.cards.map(c=>c.rank))
    const deact = this.props.hand.map((h)=>!h.isActive)

    let bg = '#f66';
    let fg = '#faa';
    let blk = '#000'; 

    let output = []

    // for debugging
    if (false) {
      output.push(
        <rect x={x(0)} y={y(0)} width={w(100)} height={w(75)}
              fill="none" stroke="black"/>
      )
    }

    // one hand aka dealer or player who didn't split
    if (this.props.hand.length === 1) {

      for (let i=0; i<4; i++) {
        output.push(<Card x={x(0+i*22)}  y={y(0)}  w={w(30)}
          suit={suits[0][i]} rank={ranks[0][i]} deact={deact[0]}/>)
      }
      for (let i=4; i<8; i++) {
        output.push(<Card x={x(4+(i-4)*22)}  y={y(40)}  w={w(30)}
          suit={suits[0][i]} rank={ranks[0][i]} deact={deact[0]}/>)
      }
    }

    // two hands aka player who split
    if (this.props.hand.length === 2) {
      for (let i=0; i<8; i++) {
        output.push(<Card x={x(0+i*12)}  y={y(0)}  w={w(16)}
          suit={suits[0][i]} rank={ranks[0][i]} deact={deact[0]} />)
      }
      for (let i=8; i<15; i++) {
        output.push(<Card x={x(3+(i-8)*12)}  y={y(20)}  w={w(16)}
          suit={suits[0][i]} rank={ranks[0][i]} deact={deact[0]}/>)
      }
      for (let i=0; i<8; i++) {
        output.push(<Card x={x(0+i*12)}  y={y(40)}  w={w(16)}
          suit={suits[1][i]} rank={ranks[1][i]} deact={deact[1]}/>)
      }
      for (let i=8; i<15; i++) {
        output.push(<Card x={x(3+(i-8)*12)}  y={y(60)}  w={w(16)}
          suit={suits[1][i]} rank={ranks[1][i]} deact={deact[1]}/>)
      }
    }

    return(<g>{output}</g>)
  }
}

