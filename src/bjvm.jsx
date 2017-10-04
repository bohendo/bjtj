
import React from 'react';
import style from './bjvm.scss';

import Card from './card.jsx';
import Dealer from './dealer.jsx';

import {Hit, Stay} from './buttons.jsx';

export default class BJVM extends React.Component { 
  render() { 

    let height = 500;
    let width = 500;
    let depth = 25;

    let top_panel = `0,${depth} ${depth},0
                     ${width+depth},0 ${width},${depth}`

    let right_panel = `${width+depth},0 ${width+depth},${height}
                     ${width},${height+depth} ${width},${depth}`

    return (

<div class="center canvas">

  <svg height={height+depth} width={height+depth} id="bjvm-svg">

    <rect x="0" y={depth} height={height} width={width}
          fill="#171" stroke="white"/>
    <polygon points={top_panel} fill="#171" stroke="white"/>
    <polygon points={right_panel} fill="#171" stroke="white"/>

    <Dealer />

    <Card x="175" y="100" size="75" suit="hidden" rank="hidden" />
    <Card x="200" y="150" size="75" suit="spades" rank="J" />

    <Card x="50" y="325" size="100" suit="clubs" rank="A" />
    <Card x="175" y="325" size="100" suit="hearts" rank="7" />

    <Hit x="315" y="310"/>
    <Stay x="315" y="410"/>

  </svg> 

</div>

); } }


// For ease of development
class Grid extends React.Component { render() { return (
<g>

  <line x1="50" x2="50" y1="25" y2="525" stroke="black"/>
  <line x1="100" x2="100" y1="25" y2="525" stroke="black"/>
  <line x1="150" x2="150" y1="25" y2="525" stroke="black"/>
  <line x1="200" x2="200" y1="25" y2="525" stroke="black"/>
  <line x1="250" x2="250" y1="25" y2="525" stroke="black"/>
  <line x1="300" x2="300" y1="25" y2="525" stroke="black"/>
  <line x1="350" x2="350" y1="25" y2="525" stroke="black"/>
  <line x1="400" x2="400" y1="25" y2="525" stroke="black"/>
  <line x1="450" x2="450" y1="25" y2="525" stroke="black"/>

  <line x1="0" x2="500" y1="75" y2="75" stroke="black"/>
  <line x1="0" x2="500" y1="125" y2="125" stroke="black"/>
  <line x1="0" x2="500" y1="175" y2="175" stroke="black"/>
  <line x1="0" x2="500" y1="225" y2="225" stroke="black"/>
  <line x1="0" x2="500" y1="275" y2="275" stroke="black"/>
  <line x1="0" x2="500" y1="325" y2="325" stroke="black"/>
  <line x1="0" x2="500" y1="375" y2="375" stroke="black"/>
  <line x1="0" x2="500" y1="425" y2="425" stroke="black"/>
  <line x1="0" x2="500" y1="475" y2="475" stroke="black"/>

</g>
); } }


