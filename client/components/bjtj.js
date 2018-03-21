import React from 'react'

import Message from './message.js'
import Hand from './hand.js'
import Dealer from './dealer.js'
import Auth from './auth.js'
import Ctrls from './ctrls.js'
import Payment from './payment.js'

import { verify } from '../verify'

export default class BJTJ extends React.Component {

  cookieSync(shouldLog) {

    // get ethereum address from metamask
    if (!web3) return this.props.msg('Please install MetaMask')
    web3.eth.getAccounts((err,accounts)=>{
      if (!accounts || accounts.length === 0) {
        return this.props.msg('Please unlock MetaMask')
      }

      // get all cookies & look for ones that match bjtj_id and bjtj_ag
      const cookies = document.cookie;
      const bjtj_id = cookies.match(/bjtj_id=(0x[0-9a-f]+)/)
      const bjtj_ag = cookies.match(/bjtj_ag=(0x[0-9a-f]+)/)

      if (!bjtj_id || bjtj_id[1] !== accounts[0].toLowerCase()) {
        console.log(`Found new ethereum account: ${accounts[0].toLowerCase().substring(0,10)}...`)
        // Save this ethereum address as a cookie that will expire in 90 days
        const later = new Date(new Date().getTime() + (90 * 24*60*60*1000)).toUTCString()
        document.cookie = `bjtj_id=${accounts[0].toLowerCase()}; expires=${later}; path=/;`
      }

      if (bjtj_ag && verify(bjtj_id[1], bjtj_ag[1])) {
        if (shouldLog) console.log(`${bjtj_id[1].substring(0,10)} has an autographed cookie, awesome`)
        // If we'd previously been talking about metamask or cookies, relax we're good now
        if (this.props.message.match(/(MetaMask)|(cookie)/)) {
          this.props.msg(`Thanks for the autograph ${bjtj_id[1].substring(2,8)}!`)
          this.props.submit('refresh')
        }
        return this.props.auth(true)
      } else {
        if (shouldLog) console.log(`${bjtj_id[1].substring(0,10)} is missing an autographed cookie, bummer`)
        this.props.msg(`Hey ${bjtj_id[1].substring(2,8)}, autograph this cookie to play`)
        return this.props.auth(false)
      }

    }).catch((err) => {
      console.error('Error connecting to web3, please refresh the page')
      clearInterval(this.cookieWatcher)
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

    let height = 600
    let width = 300
    let depth = 15
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
      <Auth x="25" y="300" w="250" h="200" msg={this.props.msg} submit={this.props.submit} />

    const moves = (this.props.authed) ? this.props.moves : []
    moves.push(`refresh`) // user can always refresh

    return (

<div class="center canvas">
  <svg height={height+depth} width={width+depth} id="bjtj-svg">

    <rect x="0" y={depth} height={height} width={width}
          fill={fill} stroke={stroke} />
    <polygon points={top_panel} fill={fill} stroke={stroke} />
    <polygon points={right_panel} fill={fill} stroke={stroke} />

    <Message x="15" y="30" w="270" h="35" message={this.props.message} />

    <Dealer x="15" y="75" w="90" h="170"/>
    <Hand x="110" y="85" w="180" hand={[{ cards: this.props.dealerCards, isActive: true}]} />

    <Payment x="15" y="240" w="270" h="75" chips={this.props.chips} bet={this.props.bet}
             msg={this.props.msg} submit={this.props.submit}
             authed={this.props.authed} waiting={this.props.waiting}/>

    <Hand x="15" y="322" w="200" hand={this.props.playerHands} />

    <Ctrls x="15" y="480" w="270" h="120" submit={this.props.submit}
           moves={this.props.moves} waiting={this.props.waiting} />

    {auth}

  </svg> 
</div>

) } }

