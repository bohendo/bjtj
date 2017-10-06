
import React from 'react';
import Card from './card.jsx';

export default class Hand extends React.Component { 
  render() {

    ////////////////////////////////////////
    // Props & Magic Numbers

    const x = (n) => Number(this.props.x)+Number(this.props.w)*n/100;
    const y = (n) => Number(this.props.y)+Number(this.props.w*0.8)*n/100;
    const w = (n) => Number(this.props.w)*n/100;

    const suits = this.props.cards.map((c)=>c.suit);
    const ranks = this.props.cards.map((c)=>c.rank);

    let bg = '#f66';
    let fg = '#faa';
    let blk = '#000'; 
    const fs = 23; // fs for Font Size

    return (
<g>

{/*
  <rect x={x(0)} y={y(0)} width={w(100)} height={w(75)}
        fill="none" stroke="black"/>
*/}

  <Card x={x(0)}  y={y(0)}  w={w(30)} suit={suits[0]} rank={ranks[0]}/>
  <Card x={x(22)} y={y(0)}  w={w(30)} suit={suits[1]} rank={ranks[1]}/>
  <Card x={x(44)} y={y(0)}  w={w(30)} suit={suits[2]} rank={ranks[2]}/>
  <Card x={x(66)} y={y(0)}  w={w(30)} suit={suits[3]} rank={ranks[3]}/>
  <Card x={x(4)}  y={y(40)} w={w(30)} suit={suits[4]} rank={ranks[4]}/>
  <Card x={x(26)} y={y(40)} w={w(30)} suit={suits[5]} rank={ranks[5]}/>
  <Card x={x(48)} y={y(40)} w={w(30)} suit={suits[6]} rank={ranks[6]}/>
  <Card x={x(70)} y={y(40)} w={w(30)} suit={suits[7]} rank={ranks[7]}/>

</g>
    );
  }
}

