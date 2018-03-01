import React from 'react'
import Web3 from 'web3';

import Hand from './hand.js'
import Card from './card.js'
import Dealer from './dealer.js'
import Auth from './auth.js'
import Ctrls from './ctrls.js'
import Payment from './payment.js'
import Refresh from './refresh.js'

import { verify } from '../verify'

export default class BJVM extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      message: this.props.message,
      authenticated: false
    }
    this.updateMessage = this.updateMessage.bind(this)
    this.updateAuth = this.updateAuth.bind(this)
  }

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
      if (!cookies) return this.setState({ authenticated: false })

      let bjvm_id = cookies.match(/bjvm_id=(0x[0-9a-f]+)/)
      let bjvm_ag = cookies.match(/bjvm_ag=(0x[0-9a-f]+)/)
      if (bjvm_id && bjvm_ag && verify(bjvm_id[1], bjvm_ag[1])) {
        console.log(`User authenticated`)
        this.updateMessage(`If you tip me, I'll give you some chips :)`)
        return this.setState({ authenticated: true })
      } else {
        console.log(`User not authenticated`)
        return this.setState({ authenticated: false })
      }

    })
  }

  updateMessage(message) { this.setState({ message }) }
  updateAuth(auth) { this.setState({ authenticated: auth }) }

  render() {
    const { autograph, moves, playerHands, dealerCards,
            bet, submit, refresh, dealerAddr,
            dealerBal, playerAddr } = this.props

    let dealerHand = [{ cards: dealerCards, isActive: true}]
    let chips = this.props.chips

    ////////////////////////////////////////
    // Magic Numbers & Strings

    let height = 450
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

    const auth = (this.state.authenticated) ?
      null : 
      <Auth x="175" y="147.5" w="250" h="200" msg={this.updateMessage} auth={this.updateAuth} ag={autograph} />

    return (

<div class="center canvas">
  <svg height={height+depth} width={width+depth} id="bjvm-svg">

    <rect x="0" y={depth} height={height} width={width}
          fill={fill} stroke={stroke} />
    <polygon points={top_panel} fill={fill} stroke={stroke} />
    <polygon points={right_panel} fill={fill} stroke={stroke} />

    <Refresh x="485" y="40" w="100" h="45" refresh={refresh} />

    <rect x="15" y="42.5" width="460" height="40" rx="5" ry="5" fill="#cfc" stroke="black" />
    <text x="20" y="70" fontSize="20">{this.state.message}</text>

    <Payment x="335" y="95" w="250" h="150" chips={chips} bet={bet} />
    <Dealer x="25" y="90" w="90" h="180"/>


    <Hand x="130" y="105" w="190" hand={dealerHand} />
    <Hand x="140"  y="315" w="250" hand={playerHands} />

    <Ctrls x="335" y="260" w="250" h="150" submit={submit} moves={moves} />

    {auth}

  </svg> 
</div>

) } }

