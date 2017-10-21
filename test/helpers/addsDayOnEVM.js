var addsDayOnEVM = async function(days) {
    var daysInsecond = 60 * 60 * 24 * days
    var currentBlockTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp;
    await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [daysInsecond], id: 0});
    await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", params: [], id: 0});
}
export default  addsDayOnEVM;