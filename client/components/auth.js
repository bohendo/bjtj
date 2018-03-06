import React from 'react'
import sigUtil from 'eth-sig-util'
import { agreement, signData, verify } from '../verify'

export default class Auth extends React.Component { 

  componentWillMount() {
    // Setup initial message according to metamask/signature status
    if (!web3) { this.props.msg('Please download MetaMask'); return; }
    web3.eth.getAccounts((err,accounts)=>{
      if (!accounts || accounts.length === 0) {
        this.props.msg('Please unlock MetaMask'); return;
      }
      this.props.msg('Please sign our agreement'); return;
    })
  }

  sign() {

    web3.eth.getAccounts((err,accounts)=>{
      if (!accounts || accounts.length === 0) {
        this.props.msg('Please unlock MetaMask')
        return console.log('Please unlock MetaMask')
      }

      console.log(`Autographing, please wait...`)
      const from = accounts[0].toLowerCase()

      // https://github.com/danfinlay/js-eth-personal-sign-examples/blob/master/index.js
      web3.currentProvider.sendAsync({
        method: 'eth_signTypedData',
        params: [signData, accounts[0]],
        from
      }, (err,res) => {
        if (err) { console.error('err', err); return; }
        if (res.error) { console.log('Autograph rejected'); return; }

        if (verify(from, res.result)) {
          console.log(`Successfully verified signer: ${from}`)

          let d = new Date(); // set a cookie that will expire in 90 days
          d.setTime(d.getTime() + (90 * 24*60*60*1000))
          document.cookie = `bjvm_id=${from}; expires=${d.toUTCString()}`
          document.cookie = `bjvm_ag=${res.result}; expires=${d.toUTCString()}`
          console.log(`Cookies: ${document.cookie}`)

          // send id & autograph to server
          this.props.submit('autograph')
          this.props.submit('refresh')
          this.props.msg('Thanks for the autograph!')
        } else {
          console.log(`Failed to verify signer: ${from} ${JSON.stringify(res)}`)
        }

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

    const agreement_jsx = agreement.split(/\r?\n/).map((line,i) => {
      return(<text x={x(5)} y={y(12+8.5*i)} fontSize="14" pointerEvents="none">{line}</text>)
    })

    return (
<g>

  {/* background & outline */}
  <rect x={x(0)} y={y(0)} width={w(100)} height={h(100)}
        rx="5" ry="5" fill="#ff6" stroke="#000"/>
  <rect x={x(2.5)} y={y(2.5)} width={w(95)} height={h(95)}
        rx="5" ry="5" fill="#ffd" stroke="#000"/>

  {agreement_jsx}

  {/* Red X & line to sign */}
  <line x1={x( 8)} y1={y(94)} x2={x(92)} y2={y(94)} stroke-width="3" stroke="#000" />
  <line x1={x(10)} y1={y(76)} x2={x(20)} y2={y(91)} stroke-width="3" stroke="#a00" />
  <line x1={x(10)} y1={y(91)} x2={x(20)} y2={y(76)} stroke-width="3" stroke="#a00" />

  {/* Autograph button */}
  <g onClick={()=>this.sign()} cursor="pointer">
    <rect x={x(30)} y={y(75)} width={w(50)} height={h(15)}
          rx="5" ry="5" fill="#f55" stroke="#000"/>
    <rect x={x(31.5)} y={y(76.5)} width={w(47)} height={h(12)}
          rx="5" ry="5" fill="#fbb" stroke="#000"/>
    <text x={x(35)} y={y(85)} fontSize="18" pointerEvents="none">Autograph</text>
  </g>


</g>
    )
  }
}

