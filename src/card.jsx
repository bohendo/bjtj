
import React from 'react';

////////////////////////////////////////
// Global Variables

let ratio = 7/5; // card height/width

export default class Card extends React.Component {

  renderBack(x, y, s) {

    let m = s * 0.1; // m for margin

    return (
<g>
   <rect x={x+m} y={y+m} width={s-2*m} height={1.4*s-2*m} rx="3" ry="3"
         fill="blue" fill-opacity="0.5" stroke="blue"/>
</g>
    );
   }

  ////////////////////////////////////////
  renderSuit(x, y, s, suit) {

    let shape;

    if (suit === "clubs") { shape = this.renderClub; }
    else if (suit === "diamonds") { shape = this.renderDiamond; }
    else if (suit === "hearts") { shape = this.renderHeart; }
    else if (suit === "spades") { shape = this.renderSpade; }

    // Render back of the card if this card is facedown
    else { return(this.renderBack(x, y, s)); }
 
    // tr_ for Top Right
    let tr_x = x + (s * 0.25);
    let tr_y = y + (s * 0.25);

    // bl_ for Bottom Left
    let bl_x = x + (s * 0.75);
    let bl_y = y + (s * 0.82) * ratio;

    return (
<g>
    {shape(tr_x, tr_y, s/5)}
    {shape(bl_x, bl_y, s/5)}
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

  renderRank(x, y, size, rank) {

    // Don't render text if this card is facedown
    if (rank === 'hidden') { return(<g/>); }

    return (
<g>
      <text x={x + size/3.5}
            y={y + size/1.05}
            font-size={size/1.5}>
        {rank}
      </text>

</g>
    );
   }


  render() {
    const n = Number;
    return (
<g>
      <rect x={this.props.x} y={this.props.y} rx="10" ry="10"
            width={this.props.size} height={this.props.size*ratio}
            stroke="black" fill="white"/>

      {this.renderRank(n(this.props.x), n(this.props.y),
                       n(this.props.size), this.props.rank)}

      {this.renderSuit(n(this.props.x), n(this.props.y),
                       n(this.props.size), this.props.suit)}
</g>
    );
  }
}

