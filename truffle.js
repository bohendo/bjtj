// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 9545,
      network_id: '*'
    },
    live: {
      host: process.env.BJVM_ETHPROVIDER || 'localhost',
      port: 8545,
      network_id: '3993',
      from: "0xdd8251bb8e7ba07dfcd9e1842cd9e3cdfc0399c8",
      gas: 4612000
    }
  }
}
