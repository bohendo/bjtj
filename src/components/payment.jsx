
import React from 'react';

export default class Payment extends React.Component { 

  constructor(props) {
    super(props)
    this.state = {
      dealerAddr: this.props.dealerAddr,
      dealerBal: this.props.dealerBal,
    }
  }

  cashout() {
    web3.eth.getAccounts().then((res) => {
      if (typeof(err) !== 'undefined') console.log('ERROR', err)
      console.log(`cashing out to account: ${res}`)
      this.props.cashout(res)
    })
  }

  render() {

    ////////////////////////////////////////
    // Props & Magic Numbers

    const x = (n) => Number(this.props.x)+Number(this.props.w)*n/100;
    const y = (n) => Number(this.props.y)+Number(this.props.h)*n/100;
    const w = (n) => Number(this.props.w)*n/100;
    const h = (n) => Number(this.props.h)*n/100;

    const fs = 18; // fs for Font Size

    return (
<g>

  <rect x={x(0)} y={y(0)} width={w(100)} height={h(100)}
        rx="5" ry="5" fill="#6f6" stroke="#000"/>

  <text x={x(10)} y={y(20)} fontSize="16">Dealer Address:</text>
  <text x={x(5)} y={y(35)} fontSize="10" textLength={w(90)}>
    {this.props.dealerAddr}</text>

  <text x={x(10)} y={y(52)} fontSize="16">Dealer Balance</text>
  <text x={x(10)} y={y(68)} fontSize="18">{this.props.dealerBal} mETH</text>

  <g onClick={()=>this.props.refresh()}>
    <rect x={x(5)} y={y(75)} width={w(42.5)} height={h(20)}
          rx="5" ry="5" fill="#dfd" stroke="#000"/>
    <text x={x(12)} y={y(90)} fontSize="20">Refresh</text>
  </g>

  <g onClick={()=>this.cashout()}>
    <rect x={x(52.5)} y={y(75)} width={w(42.5)} height={h(20)}
          rx="5" ry="5" fill="#dfd" stroke="#000"/>
    <text x={x(56)} y={y(90)} fontSize="20">Cash Out</text>
  </g>


</g>
    );
  }
}

