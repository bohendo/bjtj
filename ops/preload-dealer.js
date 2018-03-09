
// build/contracts/Dealer.json will be pasted above by Makefile
// it will be saved in a variable called dealerData
// this script is intended to be executed in a geth console

var dealer = web3.eth.contract(dealerData.abi)
console.log('dealer contract interface loaded & saved to variable: dealer')

var deploytx = {
  "data": dealerData.bytecode,
  "gas": 1000000,
}
console.log('dealer contract deployment transaction initialized & saved to variable: deploytx')

if (dealerData.networks[net.version]) {
  var myDealer = dealer.at(dealerData.networks[net.version].address)
  console.log('dealer has been deployed to network ', net.version, ' & this instance was saved to variable: myDealer')
}

