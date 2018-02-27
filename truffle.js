require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: "192.168.1.110",
      port: 7545,
      network_id: "*" // Match any network id
    }
  }
};
