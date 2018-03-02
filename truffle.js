require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: "192.168.1.107",
      port: 8545,
      network_id: "*" // Match any network id
    }
  }
};
