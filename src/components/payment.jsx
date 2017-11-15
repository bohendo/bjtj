
import React from 'react';

export default class Payment extends React.Component { 

  constructor(props) {
    super(props)
    this.state = {
      val: 0,
      balance: '??',
      account: '',
    }
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillMount() {
    console.log(web3.version)
  }

  handleClick() {
    console.log('fetching balance...')
    web3.eth.getAccounts().then((res) => {
      if (typeof(err) !== 'undefined') console.log('ERROR', err)
      console.log(`Got account ${res[0]}`)

      return web3.eth.getBalance(res[0]).then((balance) => {
        console.log(`Got balance ${balance} wei`)
        balance = web3.utils.fromWei(balance, "ether")
        console.log(`aka ${balance} ether`)
        this.setState({ balance })
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

    const fs = 18; // fs for Font Size

    return (
<g>

  <rect x={x(0)} y={y(0)} width={w(100)} height={h(100)}
        rx="5" ry="5" fill="#6f6" stroke="#000"/>

  <g onClick={this.handleClick}>
    <rect x={x(15)} y={y(15)} width={w(75)} height={h(25)}
          rx="5" ry="5" fill="#dfd" stroke="#000"/>
    <text x={x(20)} y={y(32)} fontSize="20">Get Balance</text>
  </g>

  <text x={x(10)} y={y(60)} fontSize="20">Balance: {this.state.balance}</text>

  <text x={x(10)} y={y(80)} fontSize="20">Storage Val: {this.state.val}</text>

</g>
    );
  }
}

