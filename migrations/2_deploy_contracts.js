var ico = artifacts.require("./PYPIco.sol");

module.exports = function(deployer) {
  var _rate = 500;
  // var _cap = web3.toWei(20000, 'ether');
  // var _goal = web3.toWei(3200, 'ether');
  
  var _cap = web3.toWei(5000, 'ether');
  var _goal = web3.toWei(50, 'ether');

  var _wallet = web3.eth.accounts[0];
  var foundation_wallet = web3.eth.accounts[1];
  var community_reward_wallet = web3.eth.accounts[2];
  var early_investor_wallet = web3.eth.accounts[3];
  var team_wallet = web3.eth.accounts[4];

  // const dayInSecond = 60 * 60 * 24;
  // const currentTimeStamp = web3.eth.getBlock(web3.eth.blockNumber).timestamp;
  // const startTimeSolidity = currentTimeStamp + 2*dayInSecond;
  // // const endTimeSolidity   = startTimeSolidity + 30*dayInSecond;
  const startTimeSolidity = 1515780000;

  const endPreSale = 1516050000;
  const end2week = 1516568400;
  const end3week = 1517173200;
  const endTimeSolidity = 1517774400;

  deployer.deploy(ico, startTimeSolidity, endPreSale, end2week, end3week, endTimeSolidity, _rate, _goal, _cap, _wallet, foundation_wallet, community_reward_wallet, early_investor_wallet, team_wallet);
};
