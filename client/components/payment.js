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

      if (!dealerData.networks[id].address) {
        return console.error(`Dealer contract hasn't been deployed`)
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
    console.log(`cashout`)
    if (!web3) return this.props.msg(`Please install MetaMask`)
    if (!dealer) return this.props.msg(`Sorry, can't find the dealer`)

  }

  tip() {
    console.log(`tip`)
    console.log(web3)
    if (!web3) return this.props.msg(`Please install MetaMask`)
    if (!this.state.dealer) return this.props.msg(`Sorry, can't find the dealer`)

    return web3.eth.getAccounts().then(accounts=>{
      return web3.eth.sendTransaction({
        from: accounts[0],
        to: this.state.dealerAddr,
        value: web3.utils.toWei('0.005', 'ether')
      }).then((receipt) => {
        console.log(`Transaction confirmed! ${JSON.stringify(receipt)}`)
      })
    })

  }

  render() {

    ////////////////////////////////////////
    // Props & Magic Numbers

    const x = (n) => Number(this.props.x)+Number(this.props.w)*n/100;
    const y = (n) => Number(this.props.y)+Number(this.props.h)*n/100;
    const w = (n) => Number(this.props.w)*n/100;
    const h = (n) => Number(this.props.h)*n/100;

    const bg = '#66f';
    const fg = '#aaf';
    const blk = '#000'; 
    const fs = 16; // fs for Font Size
    const btn_h = 37.5

    const addrlink = `https://etherscan.io/address/${this.state.dealerAddr}`

    return (
<g>

  <rect x={x(0)} y={y(0)} width={w(100)} height={h(100)}
        rx="5" ry="5" fill={bg} stroke={blk}/>

  <text x={x(3)} y={y(15)} fontSize={fs}>
    Dealer address: <a href={addrlink}>{this.state.dealerAddr.substring(0,5)}...</a>
  </text>

  <text x={x(3)} y={y(30)} fontSize={fs}>
    Dealer balance: {this.state.dealerBal} mETH
  </text>

  {/* Cash out all chips */}
  <g onClick={this.cashout} cursor="pointer">
    <rect x={x(57.5)} y={y(btn_h)} width={w(37.55)} height={h(20)}
          rx="5" ry="5" fill={fg} stroke={blk}/>
    <text x={x(60)} y={y(btn_h+15)} fontSize={fs}>
      Cashout
    </text>
  </g>

  {/* Buy 5 chips */}
  <g onClick={this.tip} cursor="pointer">
    <rect x={x(2.5)} y={y(btn_h)} width={w(50)} height={h(20)}
          rx="5" ry="5" fill={fg} stroke={blk}/>
    <text x={x(5)} y={y(btn_h + 15)} fontSize={fs}>
      Tip 5 mETH
    </text>
  </g>

  {/* Chips */}
  <text x={x(3)} y={y(75)} fontSize={fs}>
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

