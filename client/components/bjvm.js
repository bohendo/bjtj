import React from 'react'
import Web3 from 'web3';

import Hand from './hand.js'
import Card from './card.js'
import Dealer from './dealer.js'
import Auth from './auth.js'
import Button from './button.js'
import Chips from './chips.js'
import Refresh from './refresh.js'

export default class BJVM extends React.Component {

  constructor(props) {
    super(props)
    this.state = { message: this.props.message }
    this.updateMessage = this.updateMessage.bind(this)
  }

  updateMessage(message) { this.setState({ message }) }

  render() {
    const { autograph, moves, playerHands, dealerCards,
            bet, submit, refresh, dealerAddr,
            dealerBal, playerAddr } = this.props

    let dealerHand = [{ cards: dealerCards, isActive: true}]
    let chips = this.props.chips

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

    <text x="20" y="75" fontSize="20">{this.state.message}</text>

    <Dealer x="25" y="90" w="90" h="180"/>

    <Refresh x="15" y="260" w="100" h="45" refresh={refresh} />

    <Auth x="335" y="55" w="250" h="195" msg={this.updateMessage} ag={autograph} />

    <Chips x="125" y="260" w="275" h="45"
           chips={chips} bet={bet} />

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

