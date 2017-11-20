var Dealer = artifacts.require("./Dealer.sol");

module.exports = function(deployer) {
  deployer.deploy(Dealer);
};
