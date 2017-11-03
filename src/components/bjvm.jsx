
import React from 'react'

import Hand from './hand.jsx'
import Card from './card.jsx'
import Dealer from './dealer.jsx'
import Payment from './payment.jsx'
import Button from './button.jsx'
import Chips from './chips.jsx'

export default class BJVM extends React.Component { 

  render() { 
    ////////////////////////////////////////
    // Magic Numbers & Strings

    let height = 500
    let width = 600
    let depth = 25

    let address="0x09eb5799ff31d198ebe1e0124f981cbb688149d9"

    console.log(this.props)

    let moves = this.props.public.moves
    let chips = Number(this.props.public.chips)
    let bet = Number(this.props.public.bet)
    let dealerHand = [{ cards: this.props.public.dealerCards,
                        isActive: true}]
    let playerHand = this.props.public.playerHands

    let fill = "#171"
    let stroke = "#eee"

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

  <svg height={height+depth} width={width+depth} id="bjvm-svg">

    <rect x="0" y={depth} height={height} width={width}
          fill={fill} stroke={stroke} />
    <polygon points={top_panel} fill={fill} stroke={stroke} />
    <polygon points={right_panel} fill={fill} stroke={stroke} />

    <Dealer x="25" y="90" w="90" h="200"/>

    {/*<Payment x="10" y="35" w="480" h="50" address={address} />*/}
    <text x="20" y="75" fontSize="25">{this.props.message}</text>

    <Chips x="410" y="100" h="150" w="175"
           chips={chips} bet={bet} />

    {/* Deck */}
    <Card x="325" y="100" w="80" suit="?" rank="?" />
    <Card x="325" y="105" w="80" suit="?" rank="?" />
    <Card x="325" y="110" w="80" suit="?" rank="?" />
    <Card x="325" y="115" w="80" suit="?" rank="?" />
    <Card x="325" y="120" w="80" suit="?" rank="?" />
    <Card x="325" y="125" w="80" suit="?" rank="?" />
    <Card x="325" y="130" w="80" suit="?" rank="?" />
    <Card x="325" y="135" w="80" suit="?" rank="?" />

    <Hand x="130" y="115" w="180" hand={dealerHand} />
    <Hand x="20"  y="280" w="375" hand={playerHand} />

    <Button x="410" y="260" w="175" h="45" type="deal"
            fn={this.props.deal} moves={moves}/>
    <Button x="410" y="310" w="175" h="45" type="hit"
            fn={this.props.hit} moves={moves}/>
    <Button x="410" y="360" w="175" h="45" type="double"
            fn={this.props.double} moves={moves}/>
    <Button x="410" y="410" w="175" h="45" type="stand"
            fn={this.props.stand} moves={moves}/>
    <Button x="410" y="460" w="175" h="45" type="split"
            fn={this.props.split} moves={moves}/>

  </svg> 

</div>

) } }

