import { increaseTimeTo, duration } from './helpers/increaseTime';
import expectThrow from './helpers/expectThrow';
import addsDayOnEVM from './helpers/addsDayOnEVM';


const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

var PYPIco = artifacts.require("./PYPIco.sol");
var PYPToken = artifacts.require("./PYPToken.sol");
var RefundVault = artifacts.require("./RefundVault.sol");
var BigNumber = require('bignumber.js');


contract('end ico', function(accounts) {
	// account setting ----------------------------------------------------------------------
	var admin = accounts[0];
	var foundationWallet = accounts[1];
	var earlyInvestorWallet = accounts[2];
	var vestingWallet = accounts[3];

	var foundation_wallet = '0x1914f914f11af29e395a987c0d915fa986432025';
	var community_reward_wallet = '0x613908ab833439de610f34c481163f496aef0371';
  	var early_investor_wallet = '0xdbef4ae77871843f317557e76961eedec9b84cb0';
  	var team_wallet = '0x328c2b629460f2cd02d801c03ec75432184bfa42';

	var randomGuy1 = accounts[4];
	var randomGuy2 = accounts[5];
	var randomGuy3 = accounts[6];
	var randomGuy4 = accounts[7];
	var randomGuy5 = accounts[8];
	var randomGuy6 = accounts[9];

	// tool const ----------------------------------------------------------------------------
	const day = 60 * 60 * 24 * 1000;
	const dayInSecond = 60 * 60 * 24;
	const gasPriceMax = 50000000000;

	// crowdsale setting ---------------------------------------------------------------------
	const name = "PYP Token";
	const symbol = "PYP";
	const decimals = 18;
	const rate = 500;
		// translate with decimal for solitidy
	const capCrowdsaleInETH = 20000;
		// setting in wei for solidity
	const capCrowdsaleInWei = web3.toWei(capCrowdsaleInETH, "ether");

    const goalInETH = 3200;
    // setting in wei for solidity
    const goalInWei = web3.toWei(goalInETH, "ether");


    // variable to host contracts ------------------------------------------------------------
	var ico;
	var token;
	var refund_vault;

	beforeEach(async () => {
		const currentTimeStamp = web3.eth.getBlock(web3.eth.blockNumber).timestamp;
		const startTimeSolidity = currentTimeStamp + 2*dayInSecond;
		const endTimeSolidity 	= startTimeSolidity + 30*dayInSecond;

		// create de crowdsale
		ico = await PYPIco.new(startTimeSolidity, endTimeSolidity, rate,  goalInWei, capCrowdsaleInWei, admin, foundation_wallet, community_reward_wallet, early_investor_wallet, team_wallet);
		// retrieve the Token itself
		token = await PYPToken.at(await ico.token.call());
		// vault address
    	refund_vault = await RefundVault.at(await ico.vault.call());
	});

	it("ico goal not reached", async function() {
	    // ico start
        addsDayOnEVM(2);

        var icoBalanceEthBefore = await web3.eth.getBalance(refund_vault.address);
		var buying_eth = 10;
		var weiSpend = web3.toWei(buying_eth, "ether");
		// buy token within cap should work
		var r = await ico.sendTransaction({from:randomGuy1,value:weiSpend, gasPrice:gasPriceMax});

		// check token arrived on buyer
		assert((new BigNumber(10).pow(18)).mul(buying_eth).mul(500).mul(120).div(100).equals(await token.balanceOf(randomGuy1)), "randomGuy1 balance");
		// check money arrived
		assert((new BigNumber(icoBalanceEthBefore)).add(weiSpend).equals(await web3.eth.getBalance(refund_vault.address)), "eth balance 1");


        addsDayOnEVM(30);
        await ico.finalize({from: admin});
        // refund_vault manitain all eths
        assert((new BigNumber(icoBalanceEthBefore)).add(weiSpend).equals(await web3.eth.getBalance(refund_vault.address)), "eth balance 2");

        var balance = await web3.eth.getBalance(randomGuy1);

        // request refunds by anyone to the no investor address
        refund_vault.refund(randomGuy2, {from:randomGuy2});
        assert((new BigNumber(icoBalanceEthBefore)).add(weiSpend).equals(await web3.eth.getBalance(refund_vault.address)), "eth balance 3");

        var balance_before_refund = await web3.eth.getBalance(randomGuy1);
        // request refunds by anyone to the correct investor
		await refund_vault.refund(randomGuy1, {from:randomGuy2});

		console.log(icoBalanceEthBefore);
        console.log(await web3.eth.getBalance(refund_vault.address));
        assert((new BigNumber(icoBalanceEthBefore)).equals(await web3.eth.getBalance(refund_vault.address)), "eth balance 4");
        assert((new BigNumber(balance_before_refund)).add(weiSpend).equals(await web3.eth.getBalance(randomGuy1)), "eth balance 5");

        // request refunds one more time
        var balance_before_refund = await web3.eth.getBalance(randomGuy1);
        refund_vault.refund(randomGuy1, {from:randomGuy1});
        assert((new BigNumber(icoBalanceEthBefore)).equals(await web3.eth.getBalance(refund_vault.address)), "eth balance 6");
        assert((new BigNumber(balance_before_refund)).equals(await web3.eth.getBalance(randomGuy1)), "eth balance 7");

		});

    it("ico goal reached, cap not", async function() {
        // ico start
        addsDayOnEVM(2);

        var icoBalanceEthBefore = await web3.eth.getBalance(refund_vault.address);
		var buying_eth = 10000;
		var weiSpend = web3.toWei(buying_eth, "ether");
		// buy token within cap should work
		var r = await ico.sendTransaction({from:randomGuy1,value:weiSpend, gasPrice:gasPriceMax});

		// check token arrived on buyer
		assert((new BigNumber(10).pow(18)).mul(buying_eth).mul(500).mul(120).div(100).equals(await token.balanceOf(randomGuy1)), "randomGuy1 balance");
		// check money arrived
		assert((new BigNumber(icoBalanceEthBefore)).add(weiSpend).equals(await web3.eth.getBalance(refund_vault.address)), "eth balance 1");

        addsDayOnEVM(8);
		var icoBalanceEthBefore = await web3.eth.getBalance(refund_vault.address);
		var buying_eth = 5000;
		var weiSpend = web3.toWei(buying_eth, "ether");
		// buy token within cap should work
		var r = await ico.sendTransaction({from:randomGuy2,value:weiSpend, gasPrice:gasPriceMax});

		// check token arrived on buyer
		assert((new BigNumber(10).pow(18)).mul(buying_eth).mul(500).mul(110).div(100).equals(await token.balanceOf(randomGuy2)), "randomGuy2 balance");
		// check money arrived
		assert((new BigNumber(icoBalanceEthBefore)).add(weiSpend).equals(await web3.eth.getBalance(refund_vault.address)), "eth balance 2");

		//goal reached
        addsDayOnEVM(30);
        // buy after ico ended
        await expectThrow(ico.sendTransaction({from:randomGuy3,value:100, gasPrice:gasPriceMax}));
		assert(await ico.goalReached(), 'ico finished');

		// finailize ico by admin
        await ico.finalize({from: admin});
		assert((new BigNumber(await token.totalSupply())).mul(15).div(100).equals(await token.balanceOf(community_reward_wallet)), 'token balance1');
        assert((new BigNumber(await token.totalSupply())).mul(10).div(100).equals(await token.balanceOf(early_investor_wallet)), 'token balance2');
        assert((new BigNumber(await token.totalSupply())).mul(15).div(100).equals(await token.balanceOf(team_wallet)), 'token balance3');
    });
    it("ico goal reached, cap not", async function() {
        // ico start
        addsDayOnEVM(2);

        var icoBalanceEthBefore = await web3.eth.getBalance(refund_vault.address);
		var buying_eth = 10000;
		var weiSpend = web3.toWei(buying_eth, "ether");
		// buy token within cap should work
		var r = await ico.sendTransaction({from:randomGuy1,value:weiSpend, gasPrice:gasPriceMax});

		// check token arrived on buyer
		assert((new BigNumber(10).pow(18)).mul(buying_eth).mul(500).mul(120).div(100).equals(await token.balanceOf(randomGuy1)), "randomGuy1 balance");
		// check money arrived
		assert((new BigNumber(icoBalanceEthBefore)).add(weiSpend).equals(await web3.eth.getBalance(refund_vault.address)), "eth balance 1");

        addsDayOnEVM(8);
		var icoBalanceEthBefore = await web3.eth.getBalance(refund_vault.address);
		var buying_eth = 10000;
		var weiSpend = web3.toWei(buying_eth, "ether");
		// buy token within cap should work
		var r = await ico.sendTransaction({from:randomGuy2,value:weiSpend, gasPrice:gasPriceMax});

		// check token arrived on buyer
		assert((new BigNumber(10).pow(18)).mul(buying_eth).mul(500).mul(110).div(100).equals(await token.balanceOf(randomGuy2)), "randomGuy2 balance");
		// check money arrived
		assert((new BigNumber(icoBalanceEthBefore)).add(weiSpend).equals(await web3.eth.getBalance(refund_vault.address)), "eth balance 2");

		//goal reached
        addsDayOnEVM(30);
        // buy after ico ended
        await expectThrow(ico.sendTransaction({from:randomGuy3,value:100, gasPrice:gasPriceMax}));
		assert(await ico.goalReached(), 'ico finished');

		var balance_refund_vault_before_close = await web3.eth.getBalance(refund_vault.address);
        var balance_admin_before_close = await web3.eth.getBalance(admin);
        console.log(balance_refund_vault_before_close);
        console.log(balance_admin_before_close );

		// finailize ico by admin
        await ico.finalize({from: admin});
		assert((new BigNumber(await token.totalSupply())).mul(15).div(100).equals(await token.balanceOf(community_reward_wallet)), 'token balance1');
        assert((new BigNumber(await token.totalSupply())).mul(10).div(100).equals(await token.balanceOf(early_investor_wallet)), 'token balance2');
        assert((new BigNumber(await token.totalSupply())).mul(15).div(100).equals(await token.balanceOf(team_wallet)), 'token balance3');
        assert((new BigNumber(await token.totalSupply())).mul(20).div(100).equals(await token.balanceOf(foundation_wallet)), 'token balance4');

        assert((new BigNumber(0)).equals(await token.balanceOf(refund_vault.address)), 'token balance5');
        /*
        console.log((new BigNumber(balance_admin_before_close)).add(balance_refund_vault_before_close).sub(web3.toWei(1, "ether")))
        console.log(await web3.eth.getBalance(admin))
        var admin_balance = await web3.eth.getBalance(admin);
        var new_value = (new BigNumber(balance_admin_before_close)).add(new BigNumber(balance_refund_vault_before_close)).sub(new BigNumber(web3.toWei(1, "ether")));
        console.log(new_value);
		(new BigNumber(admin_balance)).should.be.above(new_value)// Not recommended
		*/
    });
});



