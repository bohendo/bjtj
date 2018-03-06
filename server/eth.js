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
  console.log(`${new Date().toISOString()} [ETH] ${msg}`)
}

////////////////////////////////////////

const secret = 'secret' //fs.readFileSync(`/run/secrets/${process.env.ETH_ADDRESS}`, 'utf8')

var web3 // will provide either via ws or ipc
if (process.env.NODE_ENV === 'development') {
  web3 = new Web3('ws://ethprovider_ganache:7545')
} else {
  var web3 = new Web3(new Web3.providers.IpcProvider(
    process.env.ETH_PROVIDER,
    new net.Socket()
  ))
}

const getDealer = () => {
  return web3.eth.net.getId().then((id)=>{

    if (!dealerData.networks[id]) {
      die(`Dealer contract hasn't been deployed to network ${id}`)
    }

    const dealerAddr = dealerData.networks[id].address
    return (new web3.eth.Contract(dealerData.abi, dealerAddr))

  }).catch(die)
}

////////////////////////////////////////
const eth = {}

eth.dealerData = () => {
  return getDealer().then(dealer => {
    return web3.eth.getBalance(dealer.options.address).then((bal) => {
      return ({ dealerAddr: dealer.options.address, dealerBal: bal })
    })
  })
}
// Confirm our ethereum connection
eth.dealerData().then((dealerData) => {
  const meth = web3.utils.fromWei(dealerData.dealerBal,'milli')
  log(`Dealer at address ${dealerData.dealerAddr.substring(0,10)}.. has balace ${meth} mETH`)
})

eth.cashout = (addr, chips) => {
  log(`Cashing out ${chips} chips to ${addr.substring(0,10)}..`)
  return web3.eth.getAccounts().then(accounts => {
    if (accounts.length === 0) die(`Please load an account in this ethprovider first`)
    var myAddr = accounts[0]

    return web3.eth.personal.unlockAccount(myAddr, secret).then(res => {
      if (!res) die(`Unable to unlock account ${myAddr}`)
      log(`Pretending to cashout... account unlocked: ${res}`)
      dealer.methods.cashout(addr, web3.utils.toWei(String(chips), 'milli')).send({ from: myAddr })
    }).catch(die)

  }).catch(die)
}

////////////////////////////////////////
// Activate event listener

web3.eth.net.getId().then((id)=>{
  if (!dealerData.networks[id]) {
    die(`Dealer contract hasn't been deployed to network ${id}`)
  }

  const dealerAddr = dealerData.networks[id].address
  const dealer = new web3.eth.Contract(dealerData.abi, dealerAddr)

  dealer.events.Deposit((err, res) => {
    if (err) { die(err) }
    const chips = web3.utils.fromWei(res.returnValues._value, 'milli')
    const from = res.returnValues._from
    log(`Deposit detected: ${chips} mETH from ${from} `)
    db.deposit(from, Number(chips))
  })

}).catch(die)


export default eth
