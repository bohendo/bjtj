import React from 'react'

import Hand from './hand.js'
import Card from './card.js'
import Dealer from './dealer.js'
import Payment from './payment.js'
import Button from './button.js'
import Chips from './chips.js'

export default class BJVM extends React.Component {

  render() {
    const { message, moves, playerHands, dealerCards, bet, submit, refresh, dealerAddr, dealerBal, playerAddr } = this.props
    let dealerHand = [{ cards: dealerCards, isActive: true}]

    let chips = this.props.chips
    const cashout = (addr) => {
      if (chips === 0) {
        console.log('nothing to cash out')
      }
      chips = 0
      this.props.cashout(addr)
    }

    ////////////////////////////////////////
    // Magic Numbers & Strings

    let height = 500
    let width = 600
    let depth = 25
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

    <text x="20" y="75" fontSize="20">{message}</text>

    <Dealer x="25" y="90" w="90" h="200"/>

    <Payment x="335" y="35" w="250" h="215"
      refresh={refresh} cashout={cashout} playerAddr={playerAddr}
      dealerAddr={dealerAddr} dealerBal={dealerBal} />

    <Chips x="125" y="260" w="275" h="45"
           chips={chips} bet={bet} />

    {/* Deck
    <Card x="325" y="100" w="80" suit="?" rank="?" />
    <Card x="325" y="105" w="80" suit="?" rank="?" />
    <Card x="325" y="110" w="80" suit="?" rank="?" />
    <Card x="325" y="115" w="80" suit="?" rank="?" />
    <Card x="325" y="120" w="80" suit="?" rank="?" />
    <Card x="325" y="125" w="80" suit="?" rank="?" />
    <Card x="325" y="130" w="80" suit="?" rank="?" />
    <Card x="325" y="135" w="80" suit="?" rank="?" />
    */}

    <Hand x="130" y="105" w="190" hand={dealerHand} />
    <Hand x="140"  y="315" w="250" hand={playerHands} />

    <Button x="410" y="260" w="175" h="45" type="deal" fn={submit} moves={moves}/>
    <Button x="410" y="310" w="175" h="45" type="hit" fn={submit} moves={moves}/>
    <Button x="410" y="360" w="175" h="45" type="double" fn={submit} moves={moves}/>
    <Button x="410" y="410" w="175" h="45" type="stand" fn={submit} moves={moves}/>
    <Button x="410" y="460" w="175" h="45" type="split" fn={submit} moves={moves}/>

  </svg> 

</div>

) } }

