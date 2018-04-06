import React from 'react';
import BJTJ from '../../build/contracts/BlackjackTipJar.json'

export default class Chips extends React.Component { 

  constructor(props) {
    super(props)
    this.tip = this.tip.bind(this)
  }

  tip() {
    if (!web3) return this.props.msg(`Please install MetaMask`)
    return web3.eth.getAccounts().then(accounts=>{
      if (accounts.length === 0) return this.props.msg(`Please unlock MetaMask`)

      const bjtj = new web3.eth.Contract(BJTJ.abi, this.props.contract_address)

      if (!this.props.dealer_address.match(/0x[a-fA-F0-9]{40}/)) {
        this.props.msg(`Couldn't find a valid dealer..`)
      }

      return bjtj.methods.deposit(this.props.dealer_address).send({
        from: accounts[0],
        gas: 100000,
        value: web3.utils.toWei('0.005', 'ether')
      }).then((receipt) => {
        console.log(`Transaction confirmed! ${JSON.stringify(receipt)}`)
      }).catch((err)=>{console.log(`tx rejected`)})
    }).catch((err)=>{console.log(`Error connecting to MetaMask: ${err}`)})
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

    const etherscan = `https://etherscan.io/address/${this.props.contract_address}`


    return (<g>

      <rect x={x(0)} y={y(0)} width={w(100)} height={h(100)}
            rx="5" ry="5" fill={bg} stroke={blk}/>


      <a href={etherscan} target="_blank">
        <rect x={x(5)} y={y(10)} width={w(45)} height={h(30)}
          rx="5" ry="5" fill={fg} stroke={blk}/>
        <text x={x(7)} y={y(32)} fontSize="14">Dealer Contract</text>
      </a>

      <text x={x(55)} y={y(25)} fontSize={fs}>Dealer balance:</text>
      <text x={x(60)} y={y(45)} fontSize={fs}>{this.props.dealer_balance} mETH</text>

      {this.button('Tip 5 mETH', this.tip, can.tip,
        pos.tip.x, pos.tip.y, pos.tip.w, pos.tip.h)}

      {this.button('Cashout', ()=>{this.props.submit('cashout')}, can.cashout,
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

