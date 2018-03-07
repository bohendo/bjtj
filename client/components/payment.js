import React from 'react';
import dealerData from '../../build/contracts/Dealer.json'

export default class Chips extends React.Component { 

  constructor(props) {
    super(props)

    this.state = {
      dealer: undefined,
      dealerAddr: '0x0000000000000000000000000000000000000000',
      dealerBal: 0,
    }

    this.cashout = this.cashout.bind(this)
    this.tip = this.tip.bind(this)
  }

  componentWillMount() {
    web3.eth.net.getId().then((id)=>{

      if (!dealerData.networks[id]) {
        return console.error(`Dealer contract hasn't been deployed to network ${id}`)
      }

      const dealerAddr = dealerData.networks[id].address

      return web3.eth.getBalance(dealerAddr).then((bal) => {
        const dealerBal = web3.utils.fromWei(bal,'milli')
        return this.setState({
          dealer: new web3.eth.Contract(dealerData.abi, dealerAddr),
          dealerAddr, dealerBal
        })
      })

    })
  }

  cashout() {
    console.log(`cashout() activated!`)

    if (!web3) return this.props.msg(`Please install MetaMask`)
    if (!this.props.dealerAddr) return this.props.msg(`Sorry, can't find the dealer`)
    // send request to server
    this.props.submit('cashout')

  }

  tip() {
    console.log(`tip() activated!`)
    if (!web3) return this.props.msg(`Please install MetaMask`)
    if (!this.props.dealerAddr) return this.props.msg(`Sorry, can't find the dealer`)

    return web3.eth.getAccounts().then(accounts=>{
      return web3.eth.sendTransaction({
        from: accounts[0],
        to: this.props.dealerAddr,
        value: web3.utils.toWei('0.005', 'ether')
      }).then((receipt) => {
        console.log(`Transaction confirmed! ${JSON.stringify(receipt)}`)
      }).catch((err)=>{console.log(`tx rejected`)})
    }).catch((err)=>{console.log(`couldn't get accounts`)})
  }

  render() {

    ////////////////////////////////////////
    // Props & Magic Numbers

    const x = (n) => Number(this.props.x)+Number(this.props.w)*n/100;
    const y = (n) => Number(this.props.y)+Number(this.props.h)*n/100;
    const w = (n) => Number(this.props.w)*n/100;
    const h = (n) => Number(this.props.h)*n/100;

    const bg = '#88f';
    const fg = '#ccf';
    const blk = '#000'; 
    const fs = 16; // fs for Font Size

    const btn_h = 47.5

    const tip     = [2.5,  47.5,  52.5, 25]
    const cashout = [60, 47.5,  37.5, 25]

    const txt = [10, 22]

    const etherscan = `https://etherscan.io/address/${this.props.dealerAddr}`

    const canTip = this.props.authed
    const canCashout = this.props.authed && this.props.chips > 0

    const shade = (shouldShow) => {

    }

    return (
<g>

  <rect x={x(0)} y={y(0)} width={w(100)} height={h(100)}
        rx="5" ry="5" fill={bg} stroke={blk}/>

  <text x={x(3)} y={y(20)} fontSize={fs}>
    Dealer address: <a href={etherscan} textDecoration="underline">{this.props.dealerAddr.substring(0,7)}...</a>
  </text>

  <text x={x(3)} y={y(40)} fontSize={fs}>
    Dealer balance: {this.props.dealerBal} mETH
  </text>

  {/* Buy 5 chips */}
  <g onClick={(canTip) ? this.tip : ()=>{/*noop*/}} cursor="pointer">
     {/*cursor={ (canTip) ? "pointer" : "default"}>*/}
    <rect x={x(tip[0])} y={y(tip[1])} width={w(tip[2])} height={h(tip[3])}
          rx="5" ry="5" fill="#00f" stroke={blk}/>
    <rect x={x(tip[0])+2.5} y={y(tip[1])+2.5} width={w(tip[2])-5} height={h(tip[3])-5}
          rx="5" ry="5" fill={fg} stroke={blk}/>
    <text x={x(tip[0])+txt[0]} y={y(tip[1])+txt[1]} fontSize="18">
      Tip 5 mETH
    </text>
  </g>
  {(!canTip) ?
    <rect x={x(tip[0])} y={y(tip[1])} width={w(tip[2])} height={h(tip[3])} rx="5" ry="5" fill="#000" fillOpacity="0.6"/>
  : null }

  {/* Cash out all chips */}
  <g onClick={(canCashout) ? this.cashout : ()=>{/*noop*/}} cursor="pointer">
    <rect x={x(cashout[0])} y={y(cashout[1])} width={w(cashout[2])} height={h(cashout[3])}
          rx="5" ry="5" fill="#00f" stroke={blk}/>
    <rect x={x(cashout[0])+2.5} y={y(cashout[1])+2.5} width={w(cashout[2])-5} height={h(cashout[3])-5}
          rx="5" ry="5" fill={fg} stroke={blk}/>
    <text x={x(cashout[0])+txt[0]} y={y(cashout[1])+txt[1]} fontSize="18">
      Cashout
    </text>
  </g>
  {(!canCashout) ?
    <rect x={x(cashout[0])} y={y(cashout[1])} width={w(cashout[2])} height={h(cashout[3])} rx="5" ry="5" fill="#000" fillOpacity="0.6"/>
  : null }

  {/* Chips */}
  <text x={x(40)} y={y(90)} fontSize={fs}>
    Bet per Hand: {this.props.bet}
  </text>

  {/* Bet */}
  <text x={x(3)} y={y(90)} fontSize={fs}>
    Chips: {this.props.chips}
  </text>

</g>
    );
  }
}

