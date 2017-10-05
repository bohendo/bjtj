
import React from 'react';

let height = "50";
let width = "150";

export default class Button extends React.Component { 

  handleHit() {
    console.log("HIT");
  }

  render() {
    let x = Number(this.props.x);
    let y = Number(this.props.y);
    return (
<g onClick={()=>this.handleHit()}>

  <rect x={x} y={y} width={width} height={height} rx="5" ry="5"
        fill="#6f6" stroke="black"/>
  <text x={x+40} y={y+height} font-size={height/2}> Hit </text>

</g>
    );
  }
}

