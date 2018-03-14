
# Blackjack Tip Jar

## High-Level Overview

`server/index` contains the core node/express request pipeline. All bjtj requests hit `server/auth` then `server/api`

`server/auth` checks to ensure valid id & signature cookies are present. If that looks good, it attaches this player's gamestate to the request & passes it on to the `server/api`

`server/api` uses db, eth, and bj

`server/database`

`server/eth`

`server/blackjack` exports an object with one method: `reduce(state, action) => state`. Given a black jack game state and an action, it gives you a new state.



## Motivation

The goal of this project is to serve a few purposes:

1. Provide a beginner-friendly intro to using crypto currency as a payment method
2. Provide a reference implementation of a simple ether-based payment mechanism in a normal web browser
3. Demonstrate a small example of what I predict the future will look like

Vending machines are the original smart contract. Their robust physical design provided a level of security that, until bitcoin came alive in 2008, hasn't been possible online. Current online solutions revolve around collecting sensitive payment info and trying (and often failing) to keep it from falling into the wrong hands. A solution that's historically lead to massive data breaches and is far from the simple ideal that vending machines demonstrate.

The vending machine paradigm is ready to move online.
 - Simple payment for the customer: just send an ether payment to some address and you're good to go. No accounts or sensitive info needed. No need to even leave the page you're on. See the product you want, send funds to the appropriate address, and you're done.
 - Simple payment for the provider: No need to store (and potentially leak) your user's private info. Cutting out the account-managing machinery means the provider's back end can be simplified drastically.

The idea of a single-page product + payment handler is the perfect use-case for cryptocurrencies yet I've had trouble finding examples online. Any discussion of crypto vending machines is focused on physical machines rather then utilizing what makes them awesome in a digital setting. Most of the really exciting innovations that are popping up requires special software whether that's OpenBazaar or Mist browser, neither of which are frictionless to install & setup especially for those with little technical knowledge.

I see a future where authors will sell their books directly to consumers via these online vending machines without requiring any permission or extra software. Where bloggers and artists can replace tip-buttons with more engaging pay-to-play games. Where anyone who wants to be a casino, can be one and instead of going to a big, anonymous buildings to play slots, we play at our friend's or favorite blogger's casino knowing that the house always wins and that the winner in this case is an artist or family member who we believe deserves compensation.

## Legal Disclaimer

Know enough about the law to stay safe. If you're going to deploy this project, be aware of your country's laws regarding online gambling.

If you operate in the US, [online gambling is illegal](https://archives.fbi.gov/archives/news/stories/2007/june/gambling_060607), although [LegalZoom points out](https://www.legalzoom.com/articles/online-gambling-is-it-legal):

"""
As there is no federal law against playing online, simply placing wagers online is legal. (However, a wager must NOT be placed on a site located in the United States. More on that later.) There is a small chance players might run afoul of state law, but there is little chance of prosecution. The only case cited where a person got into trouble with a state was in 2003. Jeffrey Trauman of North Dakota paid a $500 fine on over $100,000 of online sports bet winnings.

Sites that are set up outside of the United States are legal. Therefore, gambling on websites located in areas like Australia, the Caribbean, and Latin America is legal. Just be very clear that the site you are playing on is not based on U.S. soil.
"""

TL;DR: don't deploy in the US. If you deploy outside the US, make sure you know the laws of that country.

PS Digital Ocean offers virtual private servers for rent in Singapore, a country that recently relaxed their online gambling laws.

BTW I'm not a lawyer and this isn't legal advice.
