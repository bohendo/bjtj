
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

    let s = []
    let r = []
    if (this.props.split && this.props.split.length > 0) {
      s = this.props.split.map((c)=>c.suit);
      r = this.props.split.map((c)=>c.rank);
    }

    let bg = '#f66';
    let fg = '#faa';
    let blk = '#000'; 

    if (this.props.who === 'dealer') {return (
<g>

  <rect x={x(0)} y={y(0)} width={w(100)} height={w(75)}
        fill="none" stroke="black"/>

  <Card x={x(0)}  y={y(0)}  w={w(30)} suit={suits[0]} rank={ranks[0]}/>
  <Card x={x(22)} y={y(0)}  w={w(30)} suit={suits[1]} rank={ranks[1]}/>
  <Card x={x(44)} y={y(0)}  w={w(30)} suit={suits[2]} rank={ranks[2]}/>
  <Card x={x(66)} y={y(0)}  w={w(30)} suit={suits[3]} rank={ranks[3]}/>
  <Card x={x(4)}  y={y(40)} w={w(30)} suit={suits[4]} rank={ranks[4]}/>
  <Card x={x(26)} y={y(40)} w={w(30)} suit={suits[5]} rank={ranks[5]}/>
  <Card x={x(48)} y={y(40)} w={w(30)} suit={suits[6]} rank={ranks[6]}/>
  <Card x={x(70)} y={y(40)} w={w(30)} suit={suits[7]} rank={ranks[7]}/>

</g>
    )} else if (this.props.split && this.props.split.length > 0){return (
<g>

  <rect x={x(0)} y={y(0)} width={w(100)} height={w(60)}
        fill="none" stroke="black"/>

  <Card x={x(0)}  y={y(0)}  w={w(16)} suit={suits[0]} rank={ranks[0]}/>
  <Card x={x(12)} y={y(0)}  w={w(16)} suit={suits[1]} rank={ranks[1]}/>
  <Card x={x(24)} y={y(0)}  w={w(16)} suit={suits[2]} rank={ranks[2]}/>
  <Card x={x(36)} y={y(0)}  w={w(16)} suit={suits[3]} rank={ranks[3]}/>
  <Card x={x(48)} y={y(0)}  w={w(16)} suit={suits[3]} rank={ranks[3]}/>
  <Card x={x(60)} y={y(0)}  w={w(16)} suit={suits[3]} rank={ranks[3]}/>
  <Card x={x(72)} y={y(0)}  w={w(16)} suit={suits[3]} rank={ranks[3]}/>
  <Card x={x(84)} y={y(0)}  w={w(16)} suit={suits[0]} rank={ranks[0]}/>

  <Card x={x(3)}  y={y(20)}  w={w(16)} suit={suits[0]} rank={ranks[0]}/>
  <Card x={x(15)} y={y(20)}  w={w(16)} suit={suits[1]} rank={ranks[1]}/>
  <Card x={x(27)} y={y(20)}  w={w(16)} suit={suits[1]} rank={ranks[1]}/>
  <Card x={x(40)} y={y(20)}  w={w(16)} suit={suits[1]} rank={ranks[1]}/>
  <Card x={x(52)} y={y(20)}  w={w(16)} suit={suits[1]} rank={ranks[1]}/>
  <Card x={x(64)} y={y(20)}  w={w(16)} suit={suits[1]} rank={ranks[1]}/>
  <Card x={x(76)} y={y(20)}  w={w(16)} suit={suits[1]} rank={ranks[1]}/>

  <Card x={x(0)}  y={y(40)}  w={w(16)} suit={s[0]} rank={r[0]}/>
  <Card x={x(12)} y={y(40)}  w={w(16)} suit={s[0]} rank={r[0]}/>
  <Card x={x(24)} y={y(40)}  w={w(16)} suit={s[2]} rank={r[2]}/>
  <Card x={x(36)} y={y(40)}  w={w(16)} suit={s[3]} rank={r[3]}/>
  <Card x={x(48)} y={y(40)}  w={w(16)} suit={s[3]} rank={r[3]}/>
  <Card x={x(60)} y={y(40)}  w={w(16)} suit={s[3]} rank={r[3]}/>
  <Card x={x(72)} y={y(40)}  w={w(16)} suit={s[3]} rank={r[3]}/>
  <Card x={x(84)} y={y(40)}  w={w(16)} suit={s[0]} rank={r[0]}/>

  <Card x={x(3)}  y={y(60)}  w={w(16)} suit={s[0]} rank={r[0]}/>
  <Card x={x(15)} y={y(60)}  w={w(16)} suit={s[1]} rank={r[1]}/>
  <Card x={x(27)} y={y(60)}  w={w(16)} suit={s[1]} rank={r[1]}/>
  <Card x={x(40)} y={y(60)}  w={w(16)} suit={s[1]} rank={r[1]}/>
  <Card x={x(52)} y={y(60)}  w={w(16)} suit={s[1]} rank={r[1]}/>
  <Card x={x(64)} y={y(60)}  w={w(16)} suit={s[1]} rank={r[1]}/>
  <Card x={x(76)} y={y(60)}  w={w(16)} suit={s[1]} rank={r[1]}/>

</g>
    )} else {return (
<g>

  <rect x={x(0)} y={y(0)} width={w(100)} height={w(60)}
        fill="none" stroke="black"/>

  <Card x={x(0)}  y={y(0)}  w={w(25)} suit={suits[0]} rank={ranks[0]}/>
  <Card x={x(18)} y={y(0)}  w={w(25)} suit={suits[1]} rank={ranks[1]}/>
  <Card x={x(36)} y={y(0)}  w={w(25)} suit={suits[2]} rank={ranks[2]}/>
  <Card x={x(54)} y={y(0)}  w={w(25)} suit={suits[3]} rank={ranks[3]}/>
  <Card x={x(72)} y={y(0)}  w={w(25)} suit={suits[3]} rank={ranks[3]}/>

  <Card x={x(3)}  y={y(31)} w={w(25)} suit={suits[4]} rank={ranks[4]}/>
  <Card x={x(21)} y={y(31)} w={w(25)} suit={suits[5]} rank={ranks[5]}/>
  <Card x={x(39)} y={y(31)} w={w(25)} suit={suits[6]} rank={ranks[6]}/>
  <Card x={x(57)} y={y(31)} w={w(25)} suit={suits[7]} rank={ranks[7]}/>
  <Card x={x(75)} y={y(31)} w={w(25)} suit={suits[8]} rank={ranks[8]}/>

</g>
)}
} }


