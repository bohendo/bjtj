
import fs from 'fs'

import Web3 from 'web3'
import dealerJSON from '../../build/contracts/Dealer.json'

import db from './database'
import err from '../utils/err'

console.log(`ETH: Loading in env ${JSON.stringify(process.env)}`)

const secret = 'secret' //fs.readFileSync('/run/secrets/mongo', 'utf8')

const web3 = new Web3(new Web3.providers.HttpProvider(
  `http://localhost:7545`
))

const dealer = new web3.eth.Contract(
  dealerJSON.abi,
  dealerJSON.networks[Number(process.env.BJVM_ETHID)].address,
)

var myAddr
const eth = {}

eth.dealerData = () => {
  console.log(`ETH: Fetching dealer data from ${dealer.options.address}`)
  return web3.eth.getBalance(dealer.options.address).then(bal => {
    return {
      dealerAddr: dealer.options.address,
      dealerBal: parseInt(web3.utils.fromWei(bal, 'milli'))
    }
  }).catch((error) => {
    console.error(error)
    return {
      dealerAddr: dealer.options.address,
      dealerBal: 0
    }
  })
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

/*
dealer.events.Deposit((err, res) => {
  if (err) { console.error(err); process.exit(1) }
  const chips = web3.utils.fromWei(res.returnValues._value, 'milli')
  console.log(`ETH: Deposit detected: ${chips} mETH from ${res.returnValues._from} `)
  db.getSession(res.returnValues._from).then(doc => {
    db.deposit(doc.cookie, Number(chips))
  }).catch(err)
})
*/

export default eth

