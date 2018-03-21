import React from 'react'

export default class Message extends React.Component {

  render() {

    const x = (n) => Number(this.props.x)+Number(this.props.w)*n/100;
    const y = (n) => Number(this.props.y)+Number(this.props.h)*n/100;
    const w = (n) => Number(this.props.w)*n/100;
    const h = (n) => Number(this.props.h)*n/100;

    const txt_h = 64
    const fs = 18

    // if this message contains a tx hash, replace it with an etherscan link
    const txhash = this.props.message.match(/0x[0-9a-f]{64}/)
    var message
    if (txhash) {
      const etherscan = `https://etherscan.io/tx/${txhash[0]}`
      message = <g>
        <text x={x(2.5)} y={y(txt_h)} fontSize={fs} textLength={w(95)} lengthAdjust="spacingAndGlyphs">
          Cashout tx: <a href={etherscan} textDecoration="underline">{txhash[0].substring(0,15)}...</a>
        </text>
      </g>

    } else if (this.props.message.length < 25) {
      message = <g>
        <text x={x(2.5)} y={y(txt_h)} fontSize={fs}>{this.props.message}</text>
      </g>
    } else {
      message = <g>
        <text x={x(2.5)} y={y(txt_h)} fontSize={fs} textLength={w(95)} lengthAdjust="spacingAndGlyphs">{this.props.message}</text>
      </g>
    }

    return (
<g>

    <rect x={x(0)} y={y(0)} width={w(100)} height={h(100)} rx="5" ry="5" fill="#cfc" stroke="black" />
    {message}

</g>
    )
  }
}

