pragma solidity ^0.4.15;

import "./crowdsale/CappedCrowdsale.sol";
import "./crowdsale/RefundableCrowdsale.sol";
import "./StandardCrowdsale.sol";
import "./WhitelistedCrowdsale.sol";
import "./PYPToken.sol";

contract PYPIco is CappedCrowdsale, WhitelistedCrowdsale, RefundableCrowdsale {

  uint256 public constant MINIMUM_INVESTMENT_PRESALE = 2000 finney; //2 eth
  uint256 public constant MINIMUM_INVESTMENT_MAIN = 500 finney; //0.5 eth
  uint256 public MINIMUM_INVESTMENT = 100 finney; //0.1 eth

  address public foundation_wallet;
  address public community_reward_wallet;
  address public early_investor_wallet;
  address public team_wallet;

  //Token rates
  uint256 private constant PRESALE_RATE = 150;
  uint256 private constant RATE_FOR_DAY1 = 130;
  uint256 private constant RATE_FOR_DAY27  = 120;
  uint256 private constant RATE_FOR_SECOND_WEEK = 115;


  function PYPIco(uint256 _startTime, uint256 _endPreSale, uint256 _end2week, uint256 _end3week, uint256 _endTime, uint256 _rate, uint256 _goal, uint256 _cap, address _wallet, address _foundation_wallet, address _community_reward_wallet, address _early_investor_wallet, address _team_wallet)
    CappedCrowdsale(_cap)
    FinalizableCrowdsale()
    RefundableCrowdsale(_goal)
    StandardCrowdsale(_startTime, _endPreSale, _end2week, _end3week, _endTime, _rate, _wallet)
  {
    //As goal needs to be met for a successful crowdsale
    //the value needs to less or equal than a cap which is limit for accepted funds
    require(_goal <= _cap);

    require(_foundation_wallet != address(0));
    require(_community_reward_wallet != address(0));
    require(_early_investor_wallet != address(0));
    require(_team_wallet != address(0));

    foundation_wallet = _foundation_wallet;
    community_reward_wallet = _community_reward_wallet;
    early_investor_wallet = _early_investor_wallet;
    team_wallet = _team_wallet;
  }

  function createTokenContract() internal returns (PYPToken) {
    return new PYPToken();
  }

  // @return true if the transaction can buy tokens
  function validPurchase() internal constant returns (bool) {
    bool minimumInvestment = msg.value >= MINIMUM_INVESTMENT;

    if (now > startTime && now < endPreSale) {
      minimumInvestment = msg.value >= MINIMUM_INVESTMENT_PRESALE;
    } else if (now > endPreSale && now < end3week){
      minimumInvestment = msg.value >= MINIMUM_INVESTMENT_MAIN;
    }

    return super.validPurchase() && minimumInvestment;
  }

  // @return current exchange rate 
  function getRate() public constant returns(uint){
    require(now >= startTime);

    if (now > startTime && now <= endPreSale) {
      // 08/01/2018 21:00:00 - 15/01/2018 21:00:00
      return base_rate.mul(PRESALE_RATE).div(100);
    } else if (now > endPreSale && now <= endPreSale.add(1 days)) {
      // 15/01/2018 21:00:00 - 16/01/2018 21:00:00
      return base_rate.mul(RATE_FOR_DAY1).div(100);
    } else if (now > endPreSale.add(1 days) && now <= end2week) {
      // 16/01/2018 21:00:00 - 21/01/2018 21:00:00
      return base_rate.mul(RATE_FOR_DAY27).div(100);
    } else if (now > end2week && now <= end3week) {
      // 21/01/2018 21:00:00 - 28/01/2018 21:00:00
      return base_rate.mul(RATE_FOR_SECOND_WEEK).div(100);
    } else if (now > end3week && now < endTime) {
      // no discount
      return base_rate;
    }

    return 0;
  }

  // enable token tranferability
  function enableTokenTransferability() onlyOwner {
    require(token != address(0));
    token.unpause();
  }

  // disable token tranferability
  function disableTokenTransferability() onlyOwner {
    require(token != address(0));
    token.pause();
  }

  // transfer pre sale tokend to investors
  function transferPreSaleTokens(uint256 _value, address beneficiary) onlyOwner {
    require(beneficiary != address(0));
    // require(weiRaised.add(_value) <= cap);
    // require(_value >= 15000000000000000000);//Min. investement 15 ETH
    // require(now <= endTime);
    require(now > startTime);
    // require(now <= startTime.add(7 days));

    // uint256 rate = base_rate.mul(PRESALE_RATE).div(100);
    // uint256 tokens = _value.mul(rate);
    token.mint(beneficiary, _value);

    // update state
    weiRaised = weiRaised.add(_value);

    TokenPurchase(0x0, beneficiary, 0, _value);
  }

  function changeMinimumInvestment(uint256 _value) onlyOwner {
    require(_value > 0);
    MINIMUM_INVESTMENT = _value;
  }

  function changeEndTimePreSale(uint256 _endPreSale) onlyOwner {
    require(_endPreSale >= now && _endPreSale >= startTime && _endPreSale <= end2week );
    endPreSale = _endPreSale;
  }

  function changeEndTime2week(uint256 _end2week) onlyOwner {
    require(_end2week >= now && _end2week >= endPreSale.add(1 days) && _end2week <= end3week );
    end2week = _end2week;
  }

  function changeEndTime3week(uint256 _end3week) onlyOwner {
    require(_end3week >= now && _end3week >= end2week && _end3week <= endTime );
    end3week = _end3week;
  }

  function changeEndTimeSolidity(uint256 _endTime) onlyOwner {
    require(_endTime >= now && _endTime >= end3week);
    endTime = _endTime;
  }


  /**
   * finalization logics, mint fundation tokens proportionally to currently minted amount
   */
  function finalization() internal {
    if (goalReached()) {
        // transfer tokens to teams
        uint256 current_total_supply = token.totalSupply();
        uint256 new_total_token_supply = current_total_supply.mul(100).div(40);

        uint256 community_reward_token_amount = 1250000000000000000000000;
        token.mint(community_reward_wallet, community_reward_token_amount);

        uint256 early_investor_token_amount = new_total_token_supply.mul(15).div(100);
        token.mint(early_investor_wallet, early_investor_token_amount);

        uint256 team_token_amount = new_total_token_supply.mul(20).div(100);
        token.mint(team_wallet, team_token_amount);

        uint256 foundation_token_amount = new_total_token_supply.mul(20).div(100);
        token.mint(foundation_wallet, foundation_token_amount);

        // disable minting
        assert(token.finishMinting());
        // enable token transferability
        token.unpause();
    }
    super.finalization();
  }
}

