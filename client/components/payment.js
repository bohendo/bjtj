import React from 'react';
import dealerData from '../../build/contracts/Dealer.json'

export default class Chips extends React.Component { 

  constructor(props) {
    super(props)
    this.state = { network: false, address: false, balance: false }

    this.cashout = this.cashout.bind(this)
    this.tip = this.tip.bind(this)
  }

  ethSync() {
    web3.eth.net.getId().then((network)=>{
      if (!dealerData.networks[network]) {
        return console.error(`Dealer contract hasn't been deployed to network ${network}`)
      }
      const address = dealerData.networks[network].address
      return web3.eth.getBalance(address).then((bal) => {
        const balance = Math.floor(web3.utils.fromWei(bal,'milli'))
        return this.setState({ network, address, balance })
      })
    }).catch((err) => {
      console.error('Error connecting to web3, please refresh the page')
      clearInterval(this.ethWatcher)
    })
  }

  componentDidMount() {
    this.ethSync()
    this.ethWatcher = setInterval(() => {
      this.ethSync()
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.ethWatcher)
  }

  cashout() {
    console.log(`cashout() activated!`)
    if (!web3) return this.props.msg(`Please install MetaMask`)
    if (!this.state.address) return this.props.msg(`Oops, I can't connect to MetaMask`)
    this.props.submit('cashout')
  }

  tip() {
    console.log(`tip() activated!`)
    if (!web3) return this.props.msg(`Please install MetaMask`)
    if (!this.state.address) return this.props.msg(`Oops, I can't connect to MetaMask`)

    return web3.eth.getAccounts().then(accounts=>{
      return web3.eth.sendTransaction({
        from: accounts[0],
        to: this.state.address,
        value: web3.utils.toWei('0.005', 'ether')
      }).then((receipt) => {
        console.log(`Transaction confirmed! ${JSON.stringify(receipt)}`)
      }).catch((err)=>{console.log(`tx rejected`)})
    }).catch((err)=>{console.log(`Error connecting to MetaMask`)})
  }

  button(label, fn, enabled, x, y, w, h) {

    const boarder = <rect
      x={x} y={y} width={w} height={h}
      rx="5" ry="5" fill="#00f" stroke="#000"/>

    const background = <rect
      x={x+2} y={y+2} width={w-4} height={h-4}
      rx="5" ry="5" fill="#ccf" stroke="#000"/>

    const text = <text
      x={x+10} y={y+20} fontSize="16">{label}
    </text>

    const shade = enabled ? null : <rect
        x={x} y={y} width={w} height={h}
        rx="5" ry="5" fill="#000" fillOpacity="0.6"/>

    return (<g>
      <g onClick={ enabled ? fn : ()=>{/*noop*/}} cursor="pointer">
        {boarder}
        {background}
        {text}
      </g>
      {shade}
    </g>
    )
  }

  render() {

    ////////////////////////////////////////
    // Props & Magic Numbers

    const x = (n) => Number(this.props.x)+Number(this.props.w)*n/100;
    const y = (n) => Number(this.props.y)+Number(this.props.h)*n/100;
    const w = (n) => Number(this.props.w)*n/100;
    const h = (n) => Number(this.props.h)*n/100;

    // put button position coordinates all in one place
    const pos = {
      tip:     { x: x(5), y: y(52), w: w(45), h: h(38) },
      cashout: { x: x(55), y: y(52), w: w(40), h: h(38) }
    }

    const can = {
      tip: this.props.authed && !this.props.waiting,
      cashout: this.props.authed && !this.props.waiting && this.props.chips > 0
    }

    const bg = '#99f';
    const fg = '#ddf';
    const blk = '#000'; 
    const fs = 14; // fs for Font Size

    const etherscan = `https://etherscan.io/address/${this.state.address}`


    return (<g>

      <rect x={x(0)} y={y(0)} width={w(100)} height={h(100)}
            rx="5" ry="5" fill={bg} stroke={blk}/>


      <a href={etherscan} target="_blank">
        <rect x={x(5)} y={y(10)} width={w(45)} height={h(30)}
          rx="5" ry="5" fill={fg} stroke={blk}/>
        <text x={x(7)} y={y(32)} fontSize="14">Dealer Contract</text>
      </a>

      <text x={x(55)} y={y(25)} fontSize={fs}>Dealer balance:</text>
      <text x={x(60)} y={y(45)} fontSize={fs}>{this.state.balance} mETH</text>

      {this.button('Tip 5 mETH', this.tip, can.tip,
        pos.tip.x, pos.tip.y, pos.tip.w, pos.tip.h)}

      {this.button('Cashout', this.cashout, can.cashout,
        pos.cashout.x, pos.cashout.y, pos.cashout.w, pos.cashout.h)}


      <rect x={x(75)} y={y(105)} width={w(25)} height={h(140)}
            rx="5" ry="5" fill={bg} stroke={blk}/>

      <text x={x(77.5)} y={y(135)} fontSize={fs}>Bet per</text>
      <text x={x(77.5)} y={y(155)} fontSize={fs}>hand: {this.props.bet}</text>
      <text x={x(77.5)} y={y(190)} fontSize={fs}>Chips:</text>
      <text x={x(77.5)} y={y(230)} fontSize="26">{this.props.chips}</text>

</g>
    );
  }
}

