
import React from 'react';
import style from './svg.scss';

import Card from './card.jsx';
import Dealer from './dealer.jsx';
import Payment from './payment.jsx';
import Button from './button.jsx';
import Chips from './chips.jsx';

export default class BJVM extends React.Component { 

  render() { 
    ////////////////////////////////////////
    // Magic Numbers & Strings

    let chips = 5;
    let address="0x09eb5799ff31d198ebe1e0124f981cbb688149d9";
    let height = 500;
    let width = 500;
    let depth = 25;
    let fill = "#171";
    let stroke = "#eee";

    ////////////////////////////////////////
    // Calculations

    let top_panel = `0,${depth} ${depth},0
                     ${width+depth},0 ${width},${depth}`

    let right_panel = `${width+depth},0 ${width+depth},${height}
                     ${width},${height+depth} ${width},${depth}`

    ////////////////////////////////////////
    // DOM

    return (

<div class="center canvas">

  <svg height={height+depth} width={height+depth} id="bjvm-svg">

    <rect x="0" y={depth} height={height} width={width}
          fill={fill} stroke={stroke} />
    <polygon points={top_panel} fill={fill} stroke={stroke} />
    <polygon points={right_panel} fill={fill} stroke={stroke} />

    <Dealer x="25" y="100" w="90" h="200"/>

    <Payment x="12" y="35" w="476" h="50"
             address={address} />

    <Chips x="400" y="150" h="75" w="75"
           chips={chips} />

    {/* Deck */}
    <Card x="315" y="160" w="75" suit="hidden" rank="hidden" />

    {/* Dealer's Hand */}
    <Card x="125" y="160" w="50" suit="spades" rank="8" />
    <Card x="165" y="160" w="50" suit="spades" rank="8" />
    <Card x="205" y="160" w="50" suit="diamonds" rank="A" />
    <Card x="245" y="160" w="50" suit="clubs" rank="5" />
    <Card x="135" y="220" w="50" suit="spades" rank="2" />
    <Card x="175" y="220" w="50" suit="spades" rank="2" />
    <Card x="215" y="220" w="50" suit="clubs" rank="2" />
    <Card x="255" y="220" w="50" suit="hearts" rank="6" />

    {/* Player's Hand */}
    <Card x="20"  y="300" w="90" suit="clubs" rank="A" />
    <Card x="80"  y="300" w="90" suit="hearts" rank="7" />
    <Card x="140" y="300" w="90" suit="diamonds" rank="7" />
    <Card x="200" y="300" w="90" suit="spades" rank="7" />

    <Card x="40"  y="390" w="90" suit="clubs" rank="A" />
    <Card x="100" y="390" w="90" suit="hearts" rank="7" />
    <Card x="160" y="390" w="90" suit="diamonds" rank="7" />
    <Card x="220" y="390" w="90" suit="spades" rank="7" />

    <Button x="315" y="350" w="150" h="75"
            type="deal" />


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

  <line x1="0" x2="500" y1="50" y2="50" stroke="black"/>
  <line x1="0" x2="500" y1="100" y2="100" stroke="black"/>
  <line x1="0" x2="500" y1="150" y2="150" stroke="black"/>
  <line x1="0" x2="500" y1="200" y2="200" stroke="black"/>
  <line x1="0" x2="500" y1="250" y2="250" stroke="black"/>
  <line x1="0" x2="500" y1="300" y2="300" stroke="black"/>
  <line x1="0" x2="500" y1="350" y2="350" stroke="black"/>
  <line x1="0" x2="500" y1="400" y2="400" stroke="black"/>
  <line x1="0" x2="500" y1="450" y2="450" stroke="black"/>

</g>
); } }


