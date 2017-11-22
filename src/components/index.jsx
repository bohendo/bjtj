
import React from 'react';
import Container from '../containers'

class Index extends React.Component {


  render () {

    const handle = () => {
      var feedback = document.getElementById('feedbackText')
      var title = document.getElementById('feedbackTitle')

      if (feedback.value.length < 10) {
        title.innerHTML = "Share more thoughts"
      } else {
        console.log(`submitting ${feedback}`)
        fetch('/api/feedback', {
          method: "POST",
          body: JSON.stringify({
            feedback: feedback.value,
            userAgent: navigator.userAgent,
            timestamp: Date(),
          }),
          credentials: 'same-origin'
        }).then(res=>{
          title.innerHTML = "Thanks! Share more thoughts?"
          feedback.value = ""
        })
      }
    }

    return (
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

      <p><strong>Warning:</strong> This smart contract is only alive on my private ethereum network (see stats at <a href="http://bohendo.net">bohendo.net</a>). Do not send any real ether to the dealer yet, that comes later.</p>

      <p>You do get a few free chips though, how long can you make them last?! If you run out, don't worry. Submit some feedback in the form below and you'll be rewarded (but try not to bankrupt the dealer too quickly). Enjoy!</p>

      <hr></hr>

      <Container />

      <hr></hr>
      <br></br>

      <div style={{'textAlign':'center'}}>

        <h3 id="feedbackTitle" class="title">Share your thoughts</h3>

        <textarea id="feedbackText" name="feedback" cols="50" rows="6" placeholder="Some ideas: Your site crashes when I...   The _ would look cooler if..   blackjack rules say _ but the dealer...   I found a bug in your smart contract and stole all your ether haha..."></textarea>
        <br></br>
        <button onClick={handle}>Submit</button>
      </div>

      <hr></hr>
      <br></br>

      <p>What is this thing anyway? Hopefully, it will be a valuable learning tool for both users and developers.</p>

      <p>I'd like to write a series of blog posts that use this BlackJack vending machine to walk people through a simple, fun, low-stakes experience with Ethereum. I firmly believe that cryptocurrencies will change the world and want to give people a simple enough introduction that they can start to share my enthusiasm.</p>

      <p>If you aren't comfortable playing with ethereum yet but want to learn more, drop your email in the feedback form. I'll let you know when the live version of this app comes online so you can be the first to dig in and start peppering me with questions. I'd really appreciate this because it would help me know what to include in an FAQ to make it as helpful as possible.</p>

      <p>If you're technically sophisticated and curious about Ethereum, then please clone this project and publish a blackjack vending machine on your own personal website. See github for <a href="https://github.com/bohendo/bjvm">Blackjack vending machine source code</a>. I welcome any and all questions related to spinning up your own bjvm but beware: this app is under heavy development and you <del>might</del> will definitely need to wrestle some bugs to get it working.</p>

      <p>You might notice that I didn't publish this at blackjackvendingmachine.com or anything blackjack/crypto related. I published it on my own personal site; not out of narcisism but to take the emphasis off of this particular product and focus instead on the individuals that it may support one day. I do not want to run some giant crypto-casino. I want to be one of many individuals who focus on blogging and use pay-to-play arcade games like this to pay off their student loans. Future version of this app will be slimmer & fit onto sidebars or banners where most site hopelessly cram ads that you're (hopefully) blocking with uBlock origin or similar.</p>

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
          <p>This application uses Mongo to remember the state of your game, this guide will walk you through a secure mongo-setup</p>

        </div>

        <div class="col-lg-6">
          <a href="hash.html"><h4>Hash Functions 101</h4></a>
          <p>Hash functions play a critical role in securing bitcoin, ethereum, and every other crypto currency. But what are they?</p>

        </div>
      </div>

      <footer class="footer">
        <p>&copy; Bo Henderson {new Date().getFullYear()}</p>
      </footer>

    </div>

</div>
) } }

export default Index
