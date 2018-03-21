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

    const button = (type, x, y, w, h) => {

      const background = <rect
        x={x} y={y} width={w} height={h}
        rx="5" ry="5" fill={dark} stroke="black"/>

      const foreground = <rect
        x={x+2.5} y={y+2.5} width={w-5} height={h-5}
        rx="5" ry="5" fill={light} stroke="black"/>

      const text = <text
        x={x+12.5} y={y+23} fontSize='20'>{type.charAt(0).toUpperCase() + type.slice(1)}</text>

      const shade = (!this.props.moves.includes(type) || this.props.waiting) ?
        <rect
          x={x} y={y} width={w} height={h}
          rx="5" ry="5" fill="black" fillOpacity="0.6"/>
        : null

      return (<g>
        {background}
        <g onClick={()=>this.props.submit(type)} cursor="pointer">
          {foreground}
          {text}
        </g>
        {shade}
      </g>)
    }

    return (
<g>
  <rect x={x(0)} y={y(0)} width={w(100)} height={h(100)} rx="5" ry="5" fill={med} stroke="black"/>

  {button('deal', x(deal[0]), y(deal[1]), w(deal[2]), h(deal[3]))}
  {button('refresh', x(refresh[0]), y(refresh[1]), w(refresh[2]), h(refresh[3]))}
  {button('hit', x(hit[0]), y(hit[1]), w(hit[2]), h(hit[3]))}
  {button('stand', x(stand[0]), y(stand[1]), w(stand[2]), h(stand[3]))}
  {button('double', x(double[0]), y(double[1]), w(double[2]), h(double[3]))}
  {button('split', x(split[0]), y(split[1]), w(split[2]), h(split[3]))}

</g>
    );
  }
}

