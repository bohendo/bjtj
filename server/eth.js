import fs from 'fs'
import net from 'net'
import Web3 from 'web3'

import dealerData from '../build/contracts/Dealer.json'
import db from './database'

const die = (msg) => {
  console.error(`${new Date().toISOString()} [ETH] Fatal: ${msg}`)
  process.exit(1)
}

const log = (msg) => {
  if (true) console.log(`${new Date().toISOString()} [ETH] ${msg}`)
}


////////////////////////////////////////
// Internal utility functions

const from = process.env.ETH_ADDRESS.toLowerCase()
const secret = fs.readFileSync(`/run/secrets/${from}`, 'utf8')

var web3 // will provide either via ws or ipc
if (process.env.NODE_ENV === 'development') {
  web3 = new Web3('ws://ethprovider_ganache:8545')
} else {
  var web3 = new Web3(new Web3.providers.IpcProvider(
    process.env.ETH_PROVIDER,
    new net.Socket()
  ))
}

const BN = web3.utils.BN

const getDealer = () => {
  return web3.eth.net.getId().then((id)=>{

    if (!dealerData.networks[id]) {
      die(`Dealer contract hasn't been deployed to network ${id}`)
    }

    const address = dealerData.networks[id].address
    return (new web3.eth.Contract(dealerData.abi, address))

  }).catch(die)
}

// Test Eth connection: print stats or die
web3.eth.net.getId().then((id)=>{

  const msg = `Make sure you've loaded account ${from.substring(0,10)} into this ethprovider`
  return web3.eth.getAccounts().then(accounts => {
    if (!accounts.map(a=>a.toLowerCase()).includes(from)) die(msg)

    return getDealer().then(dealer => {
      const address = dealer.options.address

      return web3.eth.getBalance(address).then((bal) => {
        const balance = web3.utils.fromWei(bal,'milli')

        log(`Connected to network ${id}; Dealer at ${address.substring(0,10)} has balance ${balance} mETH`)

      }).catch(die)
    }).catch(die)
  }).catch(die)
}).catch(die)

////////////////////////////////////////
// Exported object methods

const eth = {}

eth.cashout = (addr, chips) => {
  log(`Cashing out ${chips} chips to ${addr.substring(0,10)}`)
  return getDealer().then((dealer) => {

    // does the dealer have enough money to cash out all these chips?
    return web3.eth.getBalance(dealer.options.address).then((bal) => {
      var amount = web3.utils.toWei(String(chips), 'milli')

      log(`comparing ${bal} vs ${amount}...`)
      // if not, cash out as many chips as we can
      if (new BN(bal).lt(new BN(amount))) { amount = bal }

      // unless we can't cash out any, then short-circuit
      if (new BN(amount).eq(new BN(0))) { return({ chipsCashed: 0, transactionHash: null }) }

      // send cashout tx
      return web3.eth.personal.unlockAccount(from, secret).then((res) => {
        if (!res) die(`Unable to unlock account ${from}`)
        return dealer.methods.cashout(addr, amount).send({ from }).then((receipt) => {

          log(`Sent ${receipt.chipsCashed} mETH to ${addr.substring(0,10)}: ${receipt.transactionHash}`)

          receipt.chipsCashed = web3.utils.fromWei(String(amount), 'milli')
          return receipt

        }).catch(die)
      }).catch(die)
    }).catch(die)
  }).catch(die)
}

////////////////////////////////////////
// Activate event listener

getDealer().then(dealer => {
  dealer.events.Deposit((err, res) => {
    if (err) { die(err) }
    const chips = web3.utils.fromWei(res.returnValues._value, 'milli')
    const from = res.returnValues._from
    log(`Deposit detected: ${chips} mETH from ${from.substring(0,10)} `)
    db.deposit(from, Number(chips))
  })
})

export default eth
