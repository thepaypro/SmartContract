var ico = artifacts.require("./PYPIco.sol");

module.exports = function(deployer) {
  var _rate = 2000;
  var _cap = web3.toWei(5000, 'ether');
  var _goal = web3.toWei(50, 'ether');

  // var _wallet = 0x132623d797FE61f8E1D1aE2aA17Fc997a4f9bf77;
  // var foundation_wallet = 0x296Ee53435c36C04dC0f275A85df7d030c8822Ec;
  // var community_reward_wallet = 0x76E03d6f0A80D1Dea630bf7e235230A2429Bfe12;
  // var early_investor_wallet = 0x160F3Df98c767BcAB3bDa1554ce6B92ecE408394;
  // var team_wallet = 0xdA210869E89C9bfe5f93750389105d5e38b0ADd0;
  

  var _wallet = web3.eth.accounts[0];
  var foundation_wallet = web3.eth.accounts[1];
  var community_reward_wallet = web3.eth.accounts[2];
  var early_investor_wallet = web3.eth.accounts[3];
  var team_wallet = web3.eth.accounts[4];

  const startTimeSolidity = 1515780000;
  const endPreSale = 1516050000;
  const end2week = 1516568400;
  const end3week = 1517173200;
  const endTimeSolidity = 1517774400;

  deployer.deploy(ico, startTimeSolidity, endPreSale, end2week, end3week, endTimeSolidity, _rate, _goal, _cap, _wallet, foundation_wallet, community_reward_wallet, early_investor_wallet, team_wallet);
};