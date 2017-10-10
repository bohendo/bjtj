
import React from 'react';

////////////////////////////////////////
// Global Variables

let ratio = 7/5; // card height/width

export default class Card extends React.Component {

  renderBack(x, y, w) {

    let m = w * 0.1; // m for margin

    return (
<g>
   <rect x={x+m} y={y+m} width={w-2*m} height={1.4*w-2*m} rx="3" ry="3"
         fill="blue" fill-opacity="0.5" stroke="blue"/>
</g>
    );
   }

  ////////////////////////////////////////
  renderSuit(x, y, w, suit) {

    let shape;

    if (suit === "C") { shape = this.renderClub; }
    else if (suit === "D") { shape = this.renderDiamond; }
    else if (suit === "H") { shape = this.renderHeart; }
    else if (suit === "S") { shape = this.renderSpade; }
    else if (suit === "?") { return(this.renderBack(x, y, w)); }
    else { return(<g/>); }
 
    // tr_ for Top Right
    let tr_x = x + (w * 0.25);
    let tr_y = y + (w * 0.25);

    // bl_ for Bottom Left
    let bl_x = x + (w * 0.75);
    let bl_y = y + (w * 0.82) * ratio;

    return (
<g>
    {shape(tr_x, tr_y, w/5)}
    {shape(bl_x, bl_y, w/5)}
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
{//  <circle cx={cx} cy={cy} r={r} fill="none" stroke="black"/> 
}
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
{//      <circle cx={cx} cy={cy} r={r} fill="none" stroke="black"/>
}
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
{//  <circle cx={cx} cy={cy} r={r} fill="none" stroke="black"/>
}
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
{//  <circle cx={cx} cy={cy} r={r} fill="none" stroke="black"/>
}
  <path d={path} fill="black" stroke="black"/>
</g>
    );
  }

  renderRank(x, y, w, rank) {

    // Don't render text if this card is facedown
    if (rank === '?') { return(<g/>); }

    return (
<g>
      <text x={x + w/3.5}
            y={y + w/1.05}
            fontSize={w/1.5}>
        {rank}
      </text>

</g>
    );
   }


  render() {

    if (!this.props.rank || !this.props.suit) {
      return(<g/>);
    }

    let deact
    if (this.props.deact) {
      deact = 0.8
    } else {
      deact = 0.0
    }

    const n = Number;
    return (
<g>
      <rect x={this.props.x} y={this.props.y} rx="10" ry="10"
            width={this.props.w} height={this.props.w*ratio}
            stroke="black" fill="white"/>

      {this.renderRank(n(this.props.x), n(this.props.y),
                       n(this.props.w), this.props.rank)}

      {this.renderSuit(n(this.props.x), n(this.props.y),
                       n(this.props.w), this.props.suit)}

      <rect x={this.props.x} y={this.props.y} rx="10" ry="10"
            width={this.props.w} height={this.props.w*ratio}
            stroke="black" fill="black" fillOpacity={deact}/>

</g>
    );
  }
}

