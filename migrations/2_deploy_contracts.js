var ico = artifacts.require("./PYPIco.sol");

module.exports = function(deployer) {
  var _rate = 2000;
  var _cap = web3.toWei(0, 'ether');
  var _goal = web3.toWei(0, 'ether');

  // var _wallet = 0x4A5446ACE419aF2261D1C0B599E59a09e67b1C41;
  // var foundation_wallet = 0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef;
  // var community_reward_wallet = 0x76E03d6f0A80D1Dea630bf7e235230A2429Bfe12;
  // var early_investor_wallet = 0x160F3Df98c767BcAB3bDa1554ce6B92ecE408394;
  // var team_wallet = 0xdA210869E89C9bfe5f93750389105d5e38b0ADd0;
  

  var _wallet = web3.eth.accounts[0];
  var foundation_wallet = web3.eth.accounts[1];
  var community_reward_wallet = web3.eth.accounts[2]; 
  var early_investor_wallet = web3.eth.accounts[3];
  var team_wallet = web3.eth.accounts[4];

  const startTimeSolidity = 1520066741;
  const endTimeSolidity = 1530066741;

  deployer.deploy(ico, startTimeSolidity, endTimeSolidity, _rate, _goal, _cap, _wallet, foundation_wallet, community_reward_wallet, early_investor_wallet, team_wallet);
};