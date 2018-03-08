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
        const balance = web3.utils.fromWei(bal,'milli')
        return this.setState({ network, address, balance })
      })
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
      }).catch((err)=>{console.log(`tx error: ${err}`)})
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
      tip:     { x: x(10), y: y(41), w: w(80), h: h(15) },
      cashout: { x: x(10), y: y(59), w: w(80), h: h(15) }
    }

    // 
    const can = {
      tip: this.props.authed,
      cashout: this.props.authed && this.props.chips > 0
    }

    const bg = '#99f';
    const fg = '#ddf';
    const blk = '#000'; 
    const fs = 16; // fs for Font Size

    const etherscan = `https://etherscan.io/address/${this.state.address}`


    return (<g>

      <rect x={x(0)} y={y(0)} width={w(100)} height={h(100)}
            rx="5" ry="5" fill={bg} stroke={blk}/>


      <a href={etherscan}>
        <rect x={x(5)} y={y(4)} width={w(90)} height={h(12)}
          rx="5" ry="5" fill={fg} stroke={blk}/>
        <text x={x(7.5)} y={y(13)} fontSize={fs}>Dealer Address</text>
      </a>

      <text x={x(7.5)} y={y(26)} fontSize={fs}>Dealer balance</text>
      <text x={x(15)} y={y(36)} fontSize={fs}>{this.state.balance} mETH</text>

      {this.button('Tip 5 mETH', this.tip, can.tip,
        pos.tip.x, pos.tip.y, pos.tip.w, pos.tip.h)}
      {this.button('Cashout', this.cashout, can.cashout,
        pos.cashout.x, pos.cashout.y, pos.cashout.w, pos.cashout.h)}

      <text x={x(7.5)} y={y(84)} fontSize={fs}> Bet per Hand: {this.props.bet} </text>
      <text x={x(7.5)} y={y(94)} fontSize={fs}> Chips: {this.props.chips} </text>

</g>
    );
  }
}

