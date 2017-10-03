
import React from 'react';
import style from './bjvm.scss';

import Card from './card.jsx';
import Dealer from './dealer.jsx';

export default class BJVM extends React.Component { 
  render() { 
    return (

<div class="center canvas">

  <svg height="525" width="525" id="bjvm">

    <rect x="0" y="25" height="500" width="500"
          fill="#171" stroke="white"/>
    <polygon points="0,25 25,0 525,0 500,25"
             fill="#171" stroke="white"/>
    <polygon points="525,0 525,500 500,525 500,25"
             fill="#171" stroke="white"/>

    <Dealer />

    <Card x="200" y="200" size="75" suit="spades" val="Q" />

    <Card x="300" y="200" size="75" suit="spades" val="A" />

    <Card x="200" y="350" size="75" suit="spades" val="7" />

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


