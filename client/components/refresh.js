
import React from 'react';

export default class Payment extends React.Component { 

  refresh() {
    this.props.refresh()
    web3.eth.getAccounts().then((res) => {
      if (res && res[0] && res[0].length === 42) {
        this.setState({ playerAddr: res[0] })
        fetch(`/api/register?addr=${res[0]}`, { credentials: 'same-origin' })
      }
    }).catch(error => {
      console.log(`web3.eth: Error connecting to ${web3.currentProvider}`)
      console.log(`web3.eth: ${error}`)
    })
  }

  render() {

    ////////////////////////////////////////
    // Props & Magic Numbers

    const x = (n) => Number(this.props.x)+Number(this.props.w)*n/100;
    const y = (n) => Number(this.props.y)+Number(this.props.h)*n/100;
    const w = (n) => Number(this.props.w)*n/100;
    const h = (n) => Number(this.props.h)*n/100;

    return (

<g onClick={()=>this.refresh()}>
  <rect x={x(0)} y={y(0)} width={w(100)} height={h(100)}
        rx="5" ry="5" fill="#6f6" stroke="#000"/>
  <rect x={x(5)} y={y(10)} width={w(90)} height={h(80)}
        rx="5" ry="5" fill="#dfd" stroke="#000"/>
  <text x={x(12)} y={y(65)} fontSize="20" pointerEvents="none">Refresh</text>
  <rect x={x(0)} y={y(0)} width={w(100)} height={h(100)}
        rx="5" ry="5" fill="#000" fillOpacity="0.8" stroke="#000"/>
</g>

    )
  }
}

