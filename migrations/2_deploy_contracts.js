var ico = artifacts.require("./PYPIco.sol");

module.exports = function(deployer) {
  var _rate = 500;
  var _cap = web3.toWei(2000, 'ether');
  var _goal = web3.toWei(500, 'ether');
  var _wallet = web3.eth.accounts[0];
  // 22 nov 2017
  var _startTime = 1511308800
  // 22 Dic 2017
  var _endTime = 1513900800
  deployer.deploy(ico, _startTime, _endTime, _rate, _goal, _cap, _wallet);
};
