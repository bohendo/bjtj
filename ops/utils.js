
// this script is intended to be loaded into a geth console

// build/contracts/BlackjackTipJar.json will be pasted above by Makefile
// it will be saved in a variable called bjtjData

var BJTJ = web3.eth.contract(bjtjData.abi)

var deploytx = {
  "data": bjtjData.bytecode,
  "gas": 1000000,
}

// Print welcome message
console.log('BlackjackTipJar contract interface loaded & saved to variable: BJTJ')
console.log('To deploy a new contract:')
console.log('  deploytx.from = eth.accounts[1]')
console.log('  personal.unlockAccount(deploytx.from)')
console.log('  BJTJ.new(deploytx)')
console.log('  personal.lockAccount(deploytx.from)')

if (bjtjData.networks[net.version]) {
  var bjtj = BJTJ.at(bjtjData.networks[net.version].address)
  console.log('BJTJ has been deployed to network ', net.version, ', this instance was saved to variable: bjtj')
}

