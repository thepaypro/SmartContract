var ico = artifacts.require("./PYPIco.sol");

module.exports = function(deployer) {
  var _rate = 500;
  // var _cap = web3.toWei(20000, 'ether');
  // var _goal = web3.toWei(3200, 'ether');
  
  var _cap = web3.toWei(80, 'ether');
  var _goal = web3.toWei(5, 'ether');

  var _wallet = web3.eth.accounts[0];
  var foundation_wallet = web3.eth.accounts[1];
  var community_reward_wallet = web3.eth.accounts[2];
  var early_investor_wallet = web3.eth.accounts[3];
  var team_wallet = web3.eth.accounts[4];

  const dayInSecond = 60 * 60 * 24;
  const currentTimeStamp = web3.eth.getBlock(web3.eth.blockNumber).timestamp;
  // const startTimeSolidity = currentTimeStamp + 2*dayInSecond;
  const startTimeSolidity = 1515441600;
  // const endTimeSolidity   = startTimeSolidity + 30*dayInSecond;
  const endTimeSolidity = 1517774400;
  deployer.deploy(ico, startTimeSolidity, endTimeSolidity, _rate, _goal, _cap, _wallet, foundation_wallet, community_reward_wallet, early_investor_wallet, team_wallet);
};
