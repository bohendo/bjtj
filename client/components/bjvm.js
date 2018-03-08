import React from 'react'

import Hand from './hand.js'
import Dealer from './dealer.js'
import Auth from './auth.js'
import Ctrls from './ctrls.js'
import Payment from './payment.js'

import { verify } from '../verify'

export default class BJVM extends React.Component {

  cookieSync(shouldLog) {

    // get ethereum address from metamask
    if (!web3) return this.props.msg('Please install MetaMask')
    web3.eth.getAccounts((err,accounts)=>{
      if (!accounts || accounts.length === 0) {
        return this.props.msg('Please unlock MetaMask')
      }

      // get all cookies & look for ones that match bjvm_id and bjvm_ag
      const cookies = document.cookie;
      const bjvm_id = cookies.match(/bjvm_id=(0x[0-9a-f]+)/)
      const bjvm_ag = cookies.match(/bjvm_ag=(0x[0-9a-f]+)/)

      if (!bjvm_id || bjvm_id[1] !== accounts[0].toLowerCase()) {
        console.log(`Found new ethereum account: ${accounts[0].toLowerCase().substring(0,10)}...`)
        // Save this ethereum address as a cookie that will expire in 90 days
        const later = new Date(new Date().getTime() + (90 * 24*60*60*1000)).toUTCString()
        document.cookie = `bjvm_id=${accounts[0].toLowerCase()}; expires=${later}; path=/;`
      }

      if (bjvm_ag && verify(bjvm_id[1], bjvm_ag[1])) {
        if (shouldLog) console.log(`${bjvm_id[1].substring(0,10)} has an autographed cookie, awesome`)
        // If we'd previously been talking about metamask or cookies, relax we're good now
        if (this.props.message.match(/(MetaMask)|(cookie)/)) {
          this.props.msg(`Thanks for the autograph ${bjvm_id[1].substring(2,8)}!`)
          this.props.submit('refresh')
        }
        return this.props.auth(true)
      } else {
        if (shouldLog) console.log(`${bjvm_id[1].substring(0,10)} is missing an autographed cookie, bummer`)
        this.props.msg(`Hey ${bjvm_id[1].substring(2,8)}, autograph this cookie to play`)
        return this.props.auth(false)
      }

    })
  }

  componentDidMount() {
    this.cookieSync(true)
    this.props.submit('refresh')

    this.cookieWatcher = setInterval(() => {
      this.cookieSync(false)
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.cookieWatcher)
  }

  render() {

    ////////////////////////////////////////
    // Magic Numbers & Strings

    let height = 400
    let width = 500
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

    const auth = (this.props.authed) ?
      null : 
      <Auth x="175" y="147.5" w="250" h="200" msg={this.props.msg} submit={this.props.submit} />

    const moves = (this.props.authed) ? this.props.moves : []
    moves.push(`refresh`) // user can always refresh

    // if this message contains a tx hash, replace it with an etherscan link
    const txhash = this.props.message.match(/0x[0-9a-f]{64}/)
    var message
    if (txhash) {
      const etherscan = `https://etherscan.io/tx/${txhash[0]}`
      message = <g>
        <text x="20" y="68" fontSize="20">
          Cashout tx: <a href={etherscan} textDecoration="underline">{txhash[0].substring(0,15)}...</a>
        </text>
      </g>

    } else {
      message = <g>
        <text x="20" y="68" fontSize="20">{this.props.message}</text>
      </g>
    }

    return (

<div class="center canvas">
  <svg height={height+depth} width={width+depth} id="bjvm-svg">

    <rect x="0" y={depth} height={height} width={width}
          fill={fill} stroke={stroke} />
    <polygon points={top_panel} fill={fill} stroke={stroke} />
    <polygon points={right_panel} fill={fill} stroke={stroke} />

    <rect x="15" y="40" width="470" height="40" rx="5" ry="5" fill="#cfc" stroke="black" />
    {message}

    <Payment x="335" y="90" w="150" h="190" chips={this.props.chips} bet={this.props.bet}
             msg={this.props.msg} submit={this.props.submit} authed={this.props.authed}/>

    <Ctrls x="235" y="290" w="250" h="120" submit={this.props.submit} moves={this.props.moves} />

    <Dealer x="15" y="90" w="90" h="180"/>

    <Hand x="115" y="100" w="210" hand={[{ cards: this.props.dealerCards, isActive: true}]} />
    <Hand x="15" y="260" w="210" hand={this.props.playerHands} />

    {auth}

  </svg> 
</div>

) } }

