
import React from 'react';

let ratio = 7/5; // card height/width

export default class Card extends React.Component {

  ////////////////////////////////////////
  renderSuit(x, y, s) {

    let shape;
    if (this.props.suit === "clubs") { shape = this.renderClub; }

    else if (this.props.suit === "diamonds") { shape = this.renderDiamond; }

    else if (this.props.suit === "hearts") { shape = this.renderHeart; }

    else if (this.props.suit === "spades") { shape = this.renderSpade; }
 
    let ns = Number(s);

    // tr_ for Top Right
    let tr_x = Number(x) + (ns * 0.25);
    let tr_y = Number(y) + (ns * 0.25);

    // bl_ for Bottom Left
    let bl_x = Number(x) + (ns * 0.75);
    let bl_y = Number(y) + (ns * 0.82) * ratio;

    return (
<g>
    {shape(tr_x, tr_y, ns/5)}
    {shape(bl_x, bl_y, ns/5)}
</g>
    );
  }

  ////////////////////////////////////////
  // Draw a club
  renderClub(cx, cy, r) {
    
    let cpx = 0.15; // critical point x scalar
    let cpy = 0.15; // critical point y scalar
    let shs = 0.15; // start height scalar
    let ar = 0.4; // arc radius scalar
    
    // Arc: xr yr x-rot sm-lg-flag pos-neg-flag x y
    let path = `M ${cx} ${cy+r*shs}
                A ${r*ar} ${r*ar} 0 1 1 ${cx-r*cpx} ${cy-r*cpy}
                A ${r*ar} ${r*ar} 0 1 1 ${cx+r*cpx} ${cy-r*cpy}
                A ${r*ar} ${r*ar} 0 1 1 ${cx} ${cy+r*shs}
                L ${cx-r*cpx} ${cy+r}
                L ${cx+r*cpx} ${cy+r}
                Z`;
   return (
<g>
  <path d={path} fill="black" stroke="black"/>
  <circle cx={cx} cy={cy} r={r} fill="none" stroke="black"/>
</g>
    );
  }

  ////////////////////////////////////////
  // Draw a Diamond
  renderDiamond(cx, cy, r) {

    let ratio = 2/3; // width/height

    let dy = r; let dx = r*ratio; 
    let points = `${cx},${cy+dy} ${cx+dx},${cy}
                  ${cx},${cy-dy} ${cx-dx},${cy}`;
    return (
<g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="black"/>
      <polygon points={points} fill="red" stroke="black"/>
</g>
    );
  }

  ////////////////////////////////////////
  // Draw a Heart
  renderHeart(cx, cy, r) {

    let sq_x= 0.75; // squeeze-x factor
    let axr = 0.45; // arc x-radius scalar
    let ayr = 0.55; // arc y-radius scalar
    let arot = 30;  // arc rotation degrees
    let shs = 0.5;  // start height scalar
    
    // Arc: xr yr x-rot sm-lg-flag pos-neg-flag x y
    let path = `M ${cx} ${cy-r*shs}
                A ${r*axr} ${r*ayr} ${-arot} 0 0 ${cx-r*sq_x} ${cy}
                L ${cx} ${cy+r}
                L ${cx+r*sq_x} ${cy}
                A ${r*axr} ${r*ayr} ${arot} 0 0 ${cx} ${cy-r*shs}
                Z`;
    return (
<g>
  <circle cx={cx} cy={cy} r={r} fill="none" stroke="black"/>
  <path d={path} fill="red" stroke="black"/>
</g>
    );
  }

  ////////////////////////////////////////
  // Draw a Spade
  renderSpade(cx, cy, r) {

    let shs = 0.2;  // start height scalar
    let ehs = 0.2;  // end-of-arc height scalar
    let sq_x= 0.8; // squeeze-x factor
    let axr = 0.45; // arc x-radius scalar
    let ayr = 0.55; // arc y-radius scalar
    let arot = 30;  // arc rotation degrees
    
    // Arc: xr yr x-rot sm-lg-flag pos-neg-flag x y
    let path = `M ${cx} ${cy+r*shs}
                A ${r*axr} ${r*ayr} ${arot} 0 1 ${cx-r*sq_x} ${cy-r*ehs}
                L ${cx} ${cy-r}
                L ${cx+r*sq_x} ${cy-r*ehs}
                A ${r*axr} ${r*ayr} ${-arot} 0 1 ${cx} ${cy+r*shs}
                L ${cx-r*0.25} ${cy+r*0.8}
                L ${cx+r*0.25} ${cy+r*0.8}
                Z`;
    return (
<g>
  <circle cx={cx} cy={cy} r={r} fill="none" stroke="black"/>
  <path d={path} fill="black" stroke="black"/>
</g>
    );
  }


  render() {
    return (
<g>
      <rect x={this.props.x} y={this.props.y} rx="10" ry="10"
            width={this.props.size} height={this.props.size*ratio}
            stroke="black" fill="white"/>

      <text x={Number(this.props.x) + Number(this.props.size)/3.5}
            y={Number(this.props.y) + Number(this.props.size)/1.05}
            font-size={this.props.size/1.5}>
        {this.props.val}
      </text>

      {this.renderSuit(this.props.x, this.props.y, this.props.size)}
</g>
    );
  }
}


