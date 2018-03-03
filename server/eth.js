import fs from 'fs'
import net from 'net'
import Web3 from 'web3'
import ganache from 'ganache-cli'

import dealerData from '../build/contracts/Dealer.json'
import db from './database'

const die = (msg) => {
  console.error(`${new Date().toISOString()} Fatal: ${msg}`)
  process.exit(1)
}

const secret = 'secret' //fs.readFileSync(`/run/secrets/${process.env.ETH_ADDRESS}`, 'utf8')

var web3 // will provide either via ws or ipc
if (process.env.NODE_ENV === 'development') {
  //web3 = new Web3(ganache.provider({ network_id: 5777 }))
  //web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
} else {
  web3 = new Web3(new Web3.providers.IpcProvider(
    process.env.ETH_PROVIDER,
    new net.Socket()
  ))
}

const eth = {}

eth.dealerData = () => {
  console.log(`ETH: Fetching dealer data`)

  return web3.eth.net.getId().then((id)=>{

    console.log('ping pong')
    if (!dealerData.networks[id]) {
      die(`Dealer contract hasn't been deployed to network ${id}`)
    }

    const dealerAddr = dealerData.networks[id].address

    return web3.eth.getBalance(dealerAddr).then((bal) => {
      const dealerBal = web3.utils.fromWei(bal,'milli')
      return ({ dealerAddr, dealerBal })
    }).catch(die)

  }).catch(die)
}

//eth.dealerData().then(dealer=>{ console.log(`[ETH] Loaded dealer data: ${JSON.stringify(dealer)}`) })

eth.cashout = (addr, chips) => {
}

/*
eth.cashout = (addr, chips) => {
  console.log(`ETH: Cashing out ${chips} chips to ${addr}`)
  return web3.eth.getAccounts().then(addresses => {
    myAddr = addresses[0]
    return web3.eth.personal.unlockAccount(myAddr, secret, 15)
  }).then(receipt => {
    return dealer.methods.cashout(addr, web3.utils.toWei(String(chips), 'milli')).send({ from: myAddr })
  }).then(receipt => {
    return receipt
  }).catch(die)
}

dealer.events.Deposit((err, res) => {
  if (err) { die(err) }
  const chips = web3.utils.fromWei(res.returnValues._value, 'milli')
  console.log(`ETH: Deposit detected: ${chips} mETH from ${res.returnValues._from} `)
  db.getSession(res.returnValues._from).then(doc => {
    db.deposit(doc.cookie, Number(chips))
  }).catch(die)
})
*/

export default eth
