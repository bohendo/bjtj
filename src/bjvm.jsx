
import React from 'react';
import style from './svg.scss';


import Hand from './hand.jsx';
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
    let bet = 1;
    let address="0x09eb5799ff31d198ebe1e0124f981cbb688149d9";
    let height = 500;
    let width = 500;
    let depth = 25;
    let fill = "#171";
    let stroke = "#eee";

    let dealerHand = [{ rank: "8", suit: "S" },
                      { rank: "A", suit: "C" },
                      { rank: "5", suit: "D" },
                      { rank: "2", suit: "H" },
                      { rank: "2", suit: "S" },
                      { rank: "6", suit: "C" }]

    let playerHand = [{ rank: "2", suit: "C" },
                      { rank: "3", suit: "S" },
                      { rank: "4", suit: "H" },
                      { rank: "A", suit: "D" },
                      { rank: "J", suit: "H" },
                      { rank: "A", suit: "H" }]

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

    <Dealer x="25" y="90" w="90" h="200"/>

    <Payment x="10" y="35" w="480" h="50"
             address={address} />

    <Chips x="390" y="100" h="150" w="100"
           chips={chips} bet={bet} />

    {/* Deck */}
    <Card x="305" y="100" w="80" suit="?" rank="?" />
    <Card x="305" y="105" w="80" suit="?" rank="?" />
    <Card x="305" y="110" w="80" suit="?" rank="?" />
    <Card x="305" y="115" w="80" suit="?" rank="?" />
    <Card x="305" y="120" w="80" suit="?" rank="?" />
    <Card x="305" y="125" w="80" suit="?" rank="?" />
    <Card x="305" y="130" w="80" suit="?" rank="?" />
    <Card x="305" y="135" w="80" suit="?" rank="?" />

    <Hand x="120" y="110" w="180" who="dealer" cards={dealerHand} />
    <Hand x="20" y="280" w="280" who="player" cards={playerHand} />

    <Button x="310" y="260" w="175" h="50" type="deal" />
    <Button x="310" y="320" w="175" h="50" type="hit" />
    <Button x="310" y="380" w="175" h="50" type="double" />
    <Button x="310" y="440" w="175" h="50" type="stand" />

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


