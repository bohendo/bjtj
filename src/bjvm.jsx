
import React from 'react';

export default class BJVM extends React.Component { 
  render() { 
    return (

<div class="center canvas">

  <svg height="600" width="600">
    <rect x="0" y="100" height="500" width="500"
          fill="#171" stroke="white"/>
    <polygon points="0,100 100,0 600,0 500,100"
             fill="#171" stroke="white"/>
    <polygon points="600,0 600,500 500,600 500,100"
             fill="#171" stroke="white"/>
    
  </svg> 

</div>

); } }
