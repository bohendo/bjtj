
import React from 'react';

export default class Dealer extends React.Component { 
  render() {
    const robogray = "#bbb";
    return (
<g>

  {/* Body */}
  <rect x="50" y="125" rx="10" ry="10" width="100" height="150"
        stroke="black" fill="black"/>
  <polygon points="65,100 100,220 135,100" fill="white"/>
  <circle cx="100" cy="160" r="6" fill="black"/>
  <polygon points="85,150 85,170 115,150 115,170" fill="black"/>

  {/* Face */}
  <rect x="50" y="90" width="25" height="20" fill={robogray} stroke="black"/>
  <rect x="125" y="90" width="25" height="20" fill={robogray} stroke="black"/>
  <rect x="96" y="50" width="8" height="20" rx="2" ry="2"
        fill={robogray} stroke="black"/> 
  <rect x="80" y="65" width="40" height="20" rx="5" ry="5"
        fill={robogray} stroke="black"/> 
  <rect x="60" y="75" width="80" height="60" rx="10" ry="10"
        fill={robogray} stroke="black"/> 
  <circle cx="100" cy="45" r="10" fill={robogray} stroke="black"/> 
  <circle cx="80" cy="95" r="8" fill="black"/> 
  <circle cx="120" cy="95" r="8" fill="black"/> 
  <rect x="75" y="120" width="50" height="6" fill="black"/> 

</g>
    );
  }
}


