
import React from 'react';

export class Hit extends React.Component { 

  handleHit() {
    console.log("HIT");
  }

  render() {
    let x = Number(this.props.x);
    let y = Number(this.props.y);
    return (
<g onClick={()=>this.handleHit()}>

  <rect x={x} y={y} width="150" height="75" rx="5" ry="5"
        fill="#6f6" stroke="black"/>
  <text x={x+40} y={y+50} font-size="50"> Hit </text>

</g>
    );
  }
}

export class Stay extends React.Component { 

  handleStay() {
    console.log("Stay");
  }

  render() {
    let x = Number(this.props.x);
    let y = Number(this.props.y);
    return (
<g onClick={()=>this.handleStay()}>

  <rect x={this.props.x} y={this.props.y} width="150" height="75" rx="5" ry="5"
        fill="#f66" stroke="black"/>
  <text x={x+30} y={y+50} font-size="50"> Stay </text>

</g>
    );
  }
}


