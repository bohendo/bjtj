// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 9545,
      network_id: '*'
    },
    private: {
      host: process.env.BJVM_ETHPROVIDER,
      port: 8545,
      network_id: '3993',
      from: process.env.BJVM_ETHADDR,
      gas: 4612000
    }
  }
}
