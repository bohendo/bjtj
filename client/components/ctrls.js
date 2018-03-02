
import React from 'react';

let height = "50";
let width = "150";

export default class Ctrls extends React.Component { 
  render() {

    ////////////////////////////////////////
    // Props & Magic Numbers

    const x = (n) => Number(this.props.x)+Number(this.props.w)*n/100;
    const y = (n) => Number(this.props.y)+Number(this.props.h)*n/100;
    const w = (n) => Number(this.props.w)*n/100;
    const h = (n) => Number(this.props.h)*n/100;

    const dark = '#709'
    const med = '#96c'
    const light = '#c9f'
    const shade = 0.6


    const deal    = [5,    6.25,  42.5, 25]
    const refresh = [52.5, 6.25,  42.5, 25]
    const hit     = [5,    37.5,  42.5, 25]
    const stand   = [52.5, 37.5,  42.5, 25]
    const double  = [5,    68.75, 42.5, 25]
    const split   = [52.5, 68.75, 42.5, 25]

    const txt = [12.5, 23]

    return (
<g>



  <rect x={x(0)} y={y(0)} width={w(100)} height={h(100)} rx="5" ry="5" fill={med} stroke="black"/>

  {/* Deal */}
  <g onClick={()=>this.props.submit('deal')} cursor="pointer">
    <rect x={x(deal[0])} y={y(deal[1])} width={w(deal[2])} height={h(deal[3])}
          rx="5" ry="5" fill={dark} stroke="black"/>
    <rect x={x(deal[0])+2.5} y={y(deal[1])+2.5} width={w(deal[2])-5} height={h(deal[3])-5}
          rx="5" ry="5" fill={light} stroke="black"/>
    <rect x={x(deal[0])} y={y(deal[1])} width={w(deal[2])} height={h(deal[3])} rx="5" ry="5" fill="black"
          fillOpacity={this.props.moves.includes('deal') ? 0.0 : shade }/>
    <text x={x(deal[0])+txt[0]} y={y(deal[1])+txt[1]} fontSize='20'>Deal</text>
  </g>

  {/* Refresh */}
  <g onClick={()=>this.props.submit('refresh')} cursor="pointer">
    <rect x={x(refresh[0])} y={y(refresh[1])} width={w(refresh[2])} height={h(refresh[3])}
          rx="5" ry="5" fill={dark} stroke="black"/>
    <rect x={x(refresh[0])+2.5} y={y(refresh[1])+2.5} width={w(refresh[2])-5} height={h(refresh[3])-5}
          rx="5" ry="5" fill={light} stroke="black"/>
    <text x={x(refresh[0])+txt[0]} y={y(refresh[1])+txt[1]} fontSize='20'>Refresh</text>
  </g>

  {/* Hit */}
  <g onClick={()=>this.props.submit('hit')} cursor="pointer">
    <rect x={x(hit[0])} y={y(hit[1])} width={w(hit[2])} height={h(hit[3])}
          rx="5" ry="5" fill={dark} stroke="black"/>
    <rect x={x(hit[0])+2.5} y={y(hit[1])+2.5} width={w(hit[2])-5} height={h(hit[3])-5} rx="5" ry="5" fill={light} stroke="black"/>
    <rect x={x(hit[0])} y={y(hit[1])} width={w(hit[2])} height={h(hit[3])} rx="5" ry="5" fill="black"
          fillOpacity={this.props.moves.includes('hit') ? 0.0 : shade }/>
    <text x={x(hit[0])+txt[0]} y={y(hit[1])+txt[1]} fontSize='20'>Hit</text>
  </g>

  {/* Stand */}
  <g onClick={()=>this.props.submit('stand')} cursor="pointer">
    <rect x={x(stand[0])} y={y(stand[1])} width={w(stand[2])} height={h(stand[3])}
          rx="5" ry="5" fill={dark} stroke="black"/>
    <rect x={x(stand[0])+2.5} y={y(stand[1])+2.5} width={w(stand[2])-5} height={h(stand[3])-5} rx="5" ry="5" fill={light} stroke="black"/>
    <rect x={x(stand[0])} y={y(stand[1])} width={w(stand[2])} height={h(stand[3])} rx="5" ry="5" fill="black"
          fillOpacity={this.props.moves.includes('stand') ? 0.0 : shade }/>
    <text x={x(stand[0])+txt[0]} y={y(stand[1])+txt[1]} fontSize='20'>Stand</text>
  </g>

  {/* Double */}
  <g onClick={()=>this.props.submit('double')} cursor="pointer">
    <rect x={x(double[0])} y={y(double[1])} width={w(double[2])} height={h(double[3])}
          rx="5" ry="5" fill={dark} stroke="black"/>
    <rect x={x(double[0])+2.5} y={y(double[1])+2.5} width={w(double[2])-5} height={h(double[3])-5} rx="5" ry="5" fill={light} stroke="black"/>
    <rect x={x(double[0])} y={y(double[1])} width={w(double[2])} height={h(double[3])} rx="5" ry="5" fill="black"
          fillOpacity={this.props.moves.includes('double') ? 0.0 : shade }/>
    <text x={x(double[0])+txt[0]} y={y(double[1])+txt[1]} fontSize='20'>Double</text>
  </g>

  {/* Split */}
  <g onClick={()=>this.props.submit('split')} cursor="pointer">
    <rect x={x(split[0])} y={y(split[1])} width={w(split[2])} height={h(split[3])}
          rx="5" ry="5" fill={dark} stroke="black"/>
    <rect x={x(split[0])+2.5} y={y(split[1])+2.5} width={w(split[2])-5} height={h(split[3])-5} rx="5" ry="5" fill={light} stroke="black"/>
    <rect x={x(split[0])} y={y(split[1])} width={w(split[2])} height={h(split[3])} rx="5" ry="5" fill="black"
          fillOpacity={this.props.moves.includes('split') ? 0.0 : shade }/>
    <text x={x(split[0])+txt[0]} y={y(split[1])+txt[1]} fontSize='20'>Split</text>
  </g>

</g>
    );
  }
}

