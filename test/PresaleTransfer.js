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


contract('Presale transfer', function(accounts) {
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
	it("presale token transfer ", async function() {
        var icoBalanceEthBefore = await web3.eth.getBalance(refund_vault.address);
	    var buying_eth = 2;
		var weiSpend = web3.toWei(buying_eth, "ether");
		var r = await ico.transferPreSaleTokens(weiSpend, randomGuy1);

		// check token arrived on buyer
		assert((new BigNumber(10).pow(18)).mul(buying_eth).mul(500).mul(135).div(100).equals(await token.balanceOf(randomGuy1)), "randomGuy1 balance");
		// check money unchanged as the pre-ico eth is not allocated here:
		assert((new BigNumber(icoBalanceEthBefore)).equals(await web3.eth.getBalance(refund_vault.address)), "foundationWallet eth balance");

		// overpass the cap
		var buying_eth = 20000;
		var weiSpend = web3.toWei(buying_eth, "ether");
        await expectThrow(ico.transferPreSaleTokens(weiSpend, randomGuy1));

	});

	it("presale token transfer after endtime", async function() {
		addsDayOnEVM(2000);

		// overpass the cap
		var buying_eth = 20000;
		var weiSpend = web3.toWei(buying_eth, "ether");
        await expectThrow(ico.transferPreSaleTokens(weiSpend, randomGuy1));
	});
});
