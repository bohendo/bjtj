import React from 'react';

export default class Dealer extends React.Component { 
  render() {

    ////////////////////////////////////////
    // Props & Magic Numbers

    const x = (n) => Number(this.props.x)+Number(this.props.w)*n/100;
    const y = (n) => Number(this.props.y)+Number(this.props.h)*n/100;
    const w = (n) => Number(this.props.w)*n/100;
    const h = (n) => Number(this.props.h)*n/100;

    const gry = "#bbb";
    const blk = '#111';

    return (
<g>

  {/* Neck & Inside mouth */}
  <rect x={x(25)} y={y(35)} width={w(50)} height={h(10)}
        fill={gry} stroke={blk}/>
  <rect x={x(25)} y={y(25)} width={w(50)} height={h(10)}
        fill={blk} stroke={blk}/>

  {/* Body */}
  <rect x={x(0)} y={y(40)} width={w(100)} height={h(50)}
        rx="10" ry="10" stroke={blk} fill={blk}/>

  {/* Shirt */}
  <path d={`M ${x(25)} ${y(40)}
            L ${x(50)} ${y(70)}
            L ${x(75)} ${y(40)} Z`}
        fill="white" stroke={blk} />

  {/* Buttons */}
  <circle cx={x(50)} cy={y(50)} r={w(2)} fill={blk} />
  <circle cx={x(50)} cy={y(55)} r={w(2)} fill={blk} />
  <circle cx={x(50)} cy={y(60)} r={w(2)} fill={blk} />

  {/* Tie */}
  <circle cx={x(50)} cy={y(45)} r={w(6)} fill={blk} />
  <path d={`M ${x(35)} ${y(40)}
            L ${x(35)} ${y(50)}
            L ${x(65)} ${y(40)}
            L ${x(65)} ${y(50)} Z`}
        fill={blk}/>

  {/* Ears */}
  <rect x={x(0)} y={y(16)} width={w(10)} height={h(7)}
        fill={gry} stroke={blk}/>
  <rect x={x(90)} y={y(16)} width={w(10)} height={h(7)}
        fill={gry} stroke={blk}/>

  {/* Antenna */}
  <rect x={x(48)} y={y(5)} width={w(4)} height={h(20)}
        rx="1" ry="1" fill={gry} stroke={blk}/> 
  <rect x={x(40)} y={y(8)} width={w(20)} height={h(10)}
        rx="1" ry="1" fill={gry} stroke={blk}/> 
  <circle cx={x(50)} cy={y(3)} r={w(5)}
          fill={gry} stroke={blk}/> 

  {/* Head */}
  <rect x={x(7)} y={y(10)} width={w(86)} height={h(20)}
        rx="5" ry="5" fill={gry} stroke={blk}/> 

  <rect x={x(25)} y={y(18)} width={w(15)} height={w(15)}
        rx="2" ry="2" fill={blk} stroke={blk}/> 

  <rect x={x(60)} y={y(18)} width={w(15)} height={w(15)}
        rx="2" ry="2" fill={blk} stroke={blk}/> 

  {/* Jaw */}
  <path d={`M ${x(10)} ${y(26)} L ${x(15)} ${y(26)}
            L ${x(30)} ${y(31)} L ${x(70)} ${y(31)}
            L ${x(85)} ${y(26)} L ${x(90)} ${y(26)}
            L ${x(90)} ${y(36)} L ${x(10)} ${y(36)}
            Z`}
        fill={gry} stroke={blk}/>

</g>
    );
  }
}


