var BlackjackTipJar = artifacts.require("./BlackjackTipJar.sol");

module.exports = function(deployer, network, accounts) {

  deployer.deploy(
    BlackjackTipJar,
    { from: accounts[0], gas: 2000000 }
  );

};
