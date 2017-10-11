pragma solidity ^0.4.15;

import "./crowdsale/CappedCrowdsale.sol";
import "./crowdsale/RefundableCrowdsale.sol";
import "./StandardCrowdsale.sol";
import "./PYPToken.sol";

contract PYPIco is CappedCrowdsale, RefundableCrowdsale {

  uint public constant MINIMUM_INVESTMENT = 500 finney; //0.5 eth 
  address public constant foundation_wallet = 0x0;
  address public constant community_reward_wallet = 0x0;
  address public constant early_investor_wallet = 0x0;
  address public constant team_wallet = 0x0;

  function PYPIco(uint256 _startTime, uint256 _endTime, uint256 _rate, uint256 _goal, uint256 _cap, address _wallet)
    CappedCrowdsale(_cap)
    FinalizableCrowdsale()
    RefundableCrowdsale(_goal)
    StandardCrowdsale(_startTime, _endTime, _rate, _wallet)
  {
    //As goal needs to be met for a successful crowdsale
    //the value needs to less or equal than a cap which is limit for accepted funds
    require(_goal <= _cap);
  }

  function createTokenContract() internal returns (PYPToken) {
    return new PYPToken();
  }

  // @return true if the transaction can buy tokens
  function validPurchase() internal constant returns (bool) {
    bool minimumInvestment = msg.value >= MINIMUM_INVESTMENT;
    return super.validPurchase() && minimumInvestment;
  }

  // @return current exchange rate 
  function getRate() public constant returns(uint){
    require(now >= startTime);
    if (now < startTime.add(1 days)){
      // day 1
      return base_rate.mul(120).div(100);
    }else if (now < startTime.add(7 days)){
      // day 2 to day 7
      return base_rate.mul(115).div(100);
    }else if (now < startTime.add(14 days)){
      // second week
      return base_rate.mul(110).div(100);
    }else if (now < endTime){
      // no discount
      return base_rate;
    }
    return 0;
  }

  
  //// enable token tranferability
  //function enableTokenTransferability() onlyOwner {
  //  require(token != address(0));
  //  token.unpause(); 
  //}

  //// disable token tranferability
  //function disableTokenTransferability() onlyOwner {
  //  require(token != address(0));
  //  token.pause(); 
  //}

  // transfer pre sale tokend to investors
  function transferPreSaleTokens(uint256 _value, address beneficiary) onlyOwner {
    require(beneficiary != address(0));
    require(weiRaised.add(_value) <= cap);

    uint256 rate = base_rate.mul(135).div(100);
    uint256 tokens = _value.mul(rate);
    token.mint(beneficiary, tokens);

    // update state
    weiRaised = weiRaised.add(_value);

    TokenPurchase(0x0, beneficiary, _value, tokens);
  }


  /**
   * finalization logics, mint fundation tokens proportionally to currently minted amount
   */
  function finalization() internal {
    uint256 current_total_supply = token.totalSupply();
    uint256 averate_token_price_per_eth = current_total_supply.div(weiRaised);
    uint256 total_ico_token_amount = averate_token_price_per_eth.mul(cap);
    uint256 new_total_token_supply = total_ico_token_amount.mul(100).div(40);
    
    uint256 unsold_ico_token_amount = total_ico_token_amount.sub(current_total_supply);
    token.mint(foundation_wallet, unsold_ico_token_amount);

    uint256 community_reward_token_amount = new_total_token_supply.mul(15).div(100);
    token.mint(community_reward_wallet, community_reward_token_amount);

    uint256 early_investor_token_amount = new_total_token_supply.mul(10).div(100);
    token.mint(early_investor_wallet, early_investor_token_amount);

    uint256 team_token_amount = new_total_token_supply.mul(15).div(100);
    token.mint(team_wallet, team_token_amount);

    uint256 foundation_token_amount = new_total_token_supply.mul(20).div(100);
    token.mint(foundation_wallet, foundation_token_amount);

    assert(token.finishMinting());
    // enable token transferability
    token.unpause();
  }
}

