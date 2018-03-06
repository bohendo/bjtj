import React from 'react'

import Hand from './hand.js'
import Dealer from './dealer.js'
import Auth from './auth.js'
import Ctrls from './ctrls.js'
import Payment from './payment.js'

import { verify } from '../verify'

export default class BJVM extends React.Component {

  componentDidMount() {

    // get account
    if (!web3) return this.props.msg('Please install MetaMask')
    web3.eth.getAccounts((err,accounts)=>{
      if (!accounts || accounts.length === 0) {
        return this.props.msg('Please unlock MetaMask')
      }
      let d = new Date(); // set a cookie that will expire in 90 days
      d.setTime(d.getTime() + (90 * 24*60*60*1000))
      document.cookie = `bjvm_id=${accounts[0].toLowerCase()}; expires=${d.toUTCString()}`
      console.log(`Found ethereum account: ${accounts[0].toLowerCase()}`)

      // get cookies
      let cookies = document.cookie;
      if (!cookies) return this.props.auth(false)

      let bjvm_id = cookies.match(/bjvm_id=(0x[0-9a-f]+)/)
      let bjvm_ag = cookies.match(/bjvm_ag=(0x[0-9a-f]+)/)
      if (bjvm_id && bjvm_ag && verify(bjvm_id[1], bjvm_ag[1])) {
        console.log(`User authenticated`)
        this.props.submit('refresh')
        this.props.msg(`If you tip me, I'll give you 1 chip per mETH`)
        return this.props.auth(true)
      } else {
        console.log(`User not authenticated`)
        return this.props.auth(false)
      }

    })
  }

  render() {

    ////////////////////////////////////////
    // Magic Numbers & Strings

    let height = 400
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

    const auth = (this.props.authenticated) ?
      null : 
      <Auth x="175" y="147.5" w="250" h="200" msg={this.props.msg} submit={this.props.submit} />

    const moves = (this.props.chips > 0 && this.props.moves.length === 0) ? ['deal'] : this.props.moves

    return (

<div class="center canvas">
  <svg height={height+depth} width={width+depth} id="bjvm-svg">

    <rect x="0" y={depth} height={height} width={width}
          fill={fill} stroke={stroke} />
    <polygon points={top_panel} fill={fill} stroke={stroke} />
    <polygon points={right_panel} fill={fill} stroke={stroke} />

    <rect x="15" y="42.5" width="460" height="40" rx="5" ry="5" fill="#cfc" stroke="black" />
    <text x="20" y="70" fontSize="20">{this.props.message}</text>

    <Payment x="340" y="110" w="250" h="125" chips={this.props.chips} bet={this.props.bet}
             dealerAddr={this.props.dealerAddr} dealerBal={this.props.dealerBal}
             msg={this.props.msg} submit={this.props.submit} />

    <Ctrls x="340" y="275" w="250" h="125" submit={this.props.submit} moves={this.props.moves} />

    <Dealer x="25" y="90" w="90" h="180"/>
    <Hand x="130" y="100" w="200" hand={[{ cards: this.props.dealerCards, isActive: true}]} />

    <Hand x="130" y="260" w="200" hand={this.props.playerHands} />

    {auth}

  </svg> 
</div>

) } }

