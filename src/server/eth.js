
import fs from 'fs'
import { err } from '../utils'

import Web3 from 'web3'
import dealerJSON from '../../build/contracts/Dealer.json'

import db from './mongo'

const secret = fs.readFileSync('/run/secrets/geth_dev', 'utf8')

const web3 = new Web3(new Web3.providers.WebsocketProvider(
  `ws://${process.env.BJVM_ETHPROVIDER || 'localhost'}:8546/`
))


const dealer = new web3.eth.Contract(
  dealerJSON.abi,
  dealerJSON.networks[3993].address,
)

const eth = {}

eth.dealerData = () => {
  return web3.eth.getBalance(dealer.options.address).then(res => {
    return {
      dealerAddr: dealer.options.address,
      dealerBal: web3.utils.fromWei(res, 'milli')
    }
  })
}

var myAddr

eth.cashout = (addr, chips) => {
  console.log(`ETH: Cashing out ${chips} chips to ${addr}`)
  return web3.eth.getAccounts().then(addresses => {
    myAddr = addresses[0]
    return web3.eth.personal.unlockAccount(myAddr, secret, 15) // unlock our management account for 15 seconds
  }).then(receipt => {
    return dealer.methods.cashout(addr, web3.utils.toWei(String(chips), 'milli')).send({ from: myAddr })
  }).then(receipt => {

    return db.states.update({ addr: addr }, { $set: { "state.public.chips": 0 } } )

  }).then(receipt => {
    return receipt
  }).catch(console.log)
}


dealer.events.Deposit((err, res) => {

  const chips = web3.utils.fromWei(res.returnValues._value, 'milli')

  console.log(`Dealer Deposit Detected: ${chips} mETH from ${res.returnValues._from}`)

  db.states.findOne({ addr: res.returnValues._from }).then((doc) => {

    const newChips = Number(doc.state.public.chips) + Number(chips)
    console.log(`User ${doc.cookie.substring(0,8)} had ${doc.state.public.chips} chips but now has ${newChips}`)
    db.states.update({ cookie: doc.cookie }, { $set: { "state.public.chips": newChips } }).then(res => {
      console.log(`result: ${JSON.stringify(res)}`)
    })

  }).catch(console.log)//err('ETH: states.update'))

})

export default eth

