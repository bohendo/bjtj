
import fs from 'fs'

import Web3 from 'web3'
import dealerJSON from '../../build/contracts/Dealer.json'

import db from './database'
import err from '../utils/err'

const secret = fs.readFileSync('/run/secrets/geth_dev', 'utf8')

const web3 = new Web3(new Web3.providers.WebsocketProvider(
  `ws://${process.env.BJVM_ETHPROVIDER || 'localhost'}:8546/`
))

const dealer = new web3.eth.Contract(
  dealerJSON.abi,
  dealerJSON.networks[3993].address,
)

var myAddr
const eth = {}

eth.dealerData = () => {
  return web3.eth.getBalance(dealer.options.address).then(bal => {
    return {
      dealerAddr: dealer.options.address,
      dealerBal: parseInt(web3.utils.fromWei(bal, 'milli'))
    }
  }).catch(err)
}


eth.cashout = (addr, chips) => {
  console.log(`ETH: Cashing out ${chips} chips to ${addr}`)
  return web3.eth.getAccounts().then(addresses => {
    myAddr = addresses[0]
    return web3.eth.personal.unlockAccount(myAddr, secret, 15)
  }).then(receipt => {
    return dealer.methods.cashout(addr, web3.utils.toWei(String(chips), 'milli')).send({ from: myAddr })
  }).then(receipt => {
    return receipt
  }).catch(err)
}


dealer.events.Deposit((err, res) => {
  const chips = web3.utils.fromWei(res.returnValues._value, 'milli')
  console.log(`ETH: Deposit detected: ${chips} mETH from ${res.returnValues._from} `)
  db.getSession(res.returnValues._from).then(doc => {
    db.deposit(doc.cookie, Number(chips))
  }).catch(err)
})

export default eth

