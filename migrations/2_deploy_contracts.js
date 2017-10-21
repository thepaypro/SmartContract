var ico = artifacts.require("./PYPIco.sol");

module.exports = function(deployer) {
  var _rate = 500;
  //var _cap = web3.toWei(20000, 'ether');
  //var _goal = web3.toWei(3200, 'ether');
  var _cap = web3.toWei(2, 'ether');
  var _goal = web3.toWei(1, 'ether');
  var _wallet = web3.eth.accounts[0];
  var foundation_wallet = 0x1914f914f11af29e395a987c0d915fa986432025;
  var community_reward_wallet = 0x613908ab833439de610f34c481163f496aef0371;
  var early_investor_wallet = 0xdbef4ae77871843f317557e76961eedec9b84cb0;
  var team_wallet = 0x328c2b629460f2cd02d801c03ec75432184bfa42;
  // 22 nov 2017
  var _startTime = 1511308800;
  // 22 Dic 2017
  var _endTime = 1513900800;
  deployer.deploy(ico, _startTime, _endTime, _rate, _goal, _cap, _wallet, foundation_wallet, community_reward_wallet, early_investor_wallet, team_wallet);
};
