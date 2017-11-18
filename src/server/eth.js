import Web3 from 'web3'

const web3 = new Web3(new Web3.providers.HttpProvider(`http://${process.env.BJVM_ETHPROVIDER || 'localhost'}:8545`))

const eth = () => {
  return web3.eth.getAccounts()
  .then(a => a[0])
  .then((addr) => {
    return web3.eth.getBalance(addr).then(bal => {
      console.log('done loading eth')
      return {
        dealerAddr: addr,
        dealerBal: parseInt(web3.utils.fromWei(bal, 'milli')),
      }
    })
  })
}

export default eth



////////////////////////////////////////
// Hello World smart contract reference

/*

import contract from 'truffle-contract'
import ssc from '../../build/contracts/SimpleStorage.json'

var instance
var dealerAddr
web3.eth.getAccounts().then((accounts) => {
  dealerAddr = accounts[0]
  return web3.eth.getBalance(accounts[0])
}).then((balance) => {
  const dealerBal = web3.utils.fromWei(balance, 'milli')
  const simpleStorage = contract(ssc)
  simpleStorage.setProvider(web3.currentProvider)

  // dirty hack for web3@1.0.0 support for http providers
  // see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
  if (typeof simpleStorage.currentProvider.sendAsync !== "function") {
    simpleStorage.currentProvider.sendAsync = function() {
      return simpleStorage.currentProvider.send.apply(
        simpleStorage.currentProvider,
        arguments
      );
    };
  }

  return simpleStorage.deployed()
}).then((res) => {
  instance = res
  // full-blown eth transaction, will take ~15s to resolve
  return instance.set(5, { from: dealerAddr })
}).then((res) => {
  return instance.get.call({ from: dealerAddr })
}).then((res) => {
  if (res === 5) console.log('Smart contract hello-world succeeded')
}).catch((err) => {
  console.log(err)
  process.exit(1)
})

*/

