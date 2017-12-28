var ico = artifacts.require("./PYPIco.sol");

module.exports = function(deployer) {
  var _rate = 500;
  // var _cap = web3.toWei(20000, 'ether');
  // var _goal = web3.toWei(3200, 'ether');
  var _cap = web3.toWei(80, 'ether');
  var _goal = web3.toWei(5, 'ether');
  // var _wallet = web3.eth.accounts[0];
  var _wallet = 0x255a8E4AA536A178929Dbfe43E6A94d899f6a7F6;
  var foundation_wallet = 0xe104Ad543b2878faC2191f94901afAf37BAaAf08;
  var community_reward_wallet = 0x0B63Dfc56AEB78e054d29aB8743F97Cbe912A3d4;
  var early_investor_wallet = 0x09B371b0679251D9C5CD9bf1A12463929e230399;
  var team_wallet = 0x497b0E603470a3439691a6B5C428e54bd908935a;
  // 01 dic 2017
  // var _startTime = 1512086400;
  // // 22 Dic 2017
  // var _endTime = 1513900800;
  // deployer.deploy(ico, _startTime, _endTime, _rate, _goal, _cap, _wallet, foundation_wallet, community_reward_wallet, early_investor_wallet, team_wallet);

    const dayInSecond = 60 * 60 * 24;
    const currentTimeStamp = web3.eth.getBlock(web3.eth.blockNumber).timestamp;
    // const startTimeSolidity = currentTimeStamp + 2*dayInSecond;
    const startTimeSolidity = 1515441600;
    // const endTimeSolidity   = startTimeSolidity + 30*dayInSecond;
    const endTimeSolidity = 1517774400;
    deployer.deploy(ico, startTimeSolidity, endTimeSolidity, _rate, _goal, _cap, _wallet, foundation_wallet, community_reward_wallet, early_investor_wallet, team_wallet);
};
