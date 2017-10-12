
import React from 'react';
import Container from '../containers'

const Index = () => (
<div>

    <div class="container">
      <div class="header clearfix">
        <nav>
          <ul class="nav nav-pills float-right">
            <li class="nav-item">
              <a class="nav-link active" href="/">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="about.html">About</a>
            </li>
          </ul>
        </nav>
        <h3 class="text-muted">BlackJack Vending Machine</h3>
      </div>

      <Container />

      <div class="row marketing">
        <div class="col-lg-6">
          <a href="nodejs.html"><h4>NodeJS</h4></a>
          <p>This application will utilize a node server, check out this article to get an overview of how Node works.</p>

        </div>

        <div class="col-lg-6">
          <a href="react.html"><h4>React</h4></a>
          <p>The BJVM frontend is built from React, this article will walk you through setting up a basic react environment and then introduce some of React's core concepts.</p>

        </div>
      </div>

      <div class="row marketing">
        <div class="col-lg-6">
          <a href="mongo.html"><h4>Mongo</h4></a>
          <p>This application doesn't use a database yet but I think it will soon. When it does, I'll set up mongo according to this guide.</p>

        </div>

        <div class="col-lg-6">
          <a href="buying-crypto.html"><h4>Buying Cryptocurrecies</h4></a>
          <p>Buying cryptocurrencies is intimidating the first time. This simple guide will walk you though some of your best options for trading in your USD.</p>

        </div>
      </div>

      <footer class="footer">
        <p>&copy; Bo Henderson {new Date().getFullYear()}</p>
      </footer>

    </div>

</div>
)

export default Index
