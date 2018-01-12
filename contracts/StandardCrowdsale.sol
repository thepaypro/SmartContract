pragma solidity ^0.4.11;

import './PYPToken.sol';
import './math/SafeMath.sol';

/**
 * @title Crowdsale
 * @dev Crowdsale is a base contract for managing a token crowdsale.
 * Crowdsales have a start and end timestamps, where investors can make
 * token purchases and the crowdsale will assign them tokens based
 * on a token per ETH rate. Funds collected are forwarded to a wallet
 * as they arrive.
 */
contract StandardCrowdsale {
  using SafeMath for uint256;

  // The token being sold
  PYPToken public token;

  // start and end timestamps where investments are allowed (both inclusive)
  uint256 public startTime;
  uint256 public endPreSale;
  uint256 public end2week;
  uint256 public end3week;
  uint256 public endTime;

  // address where funds are collected
  address public wallet;

  // how many token units a buyer gets per wei
  uint256 public base_rate;

  // amount of raised money in wei
  uint256 public weiRaised;

  /**
   * event for token purchase logging
   * @param purchaser who paid for the tokens
   * @param beneficiary who got the tokens
   * @param value weis paid for purchase
   * @param amount amount of tokens purchased
   */
  event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);


  function StandardCrowdsale(uint256 _startTime, uint256 _endPreSale, uint256 _end2week, uint256 _end3week, uint256 _endTime, uint256 _base_rate, address _wallet) {
    require(_startTime >= now);
    require(_endPreSale >= _startTime);
    require(_end2week >= _endPreSale);
    require(_end3week >= _end2week);
    require(_endTime >= _end3week);
    require(_base_rate > 0);
    require(_wallet != 0x0);

    token = createTokenContract();
    startTime = _startTime;
    endPreSale = _endPreSale;
    end2week = _end2week;
    end3week = _end3week;
    endTime = _endTime;
    base_rate = _base_rate;
    wallet = _wallet;
  }

  // creates the token to be sold.
  // override this method to have crowdsale of a specific mintable token.
  function createTokenContract() internal returns (PYPToken) {
    return new PYPToken();
  }


  // fallback function can be used to buy tokens
  function () payable {
    buyTokens(msg.sender);
  }

  // low level token purchase function
  function buyTokens(address beneficiary) public payable {
    require(beneficiary != 0x0);
    require(validPurchase());

    uint256 weiAmount = msg.value;

    // calculate token amount to be created
    uint256 rate = getRate();
    uint256 tokens = weiAmount.mul(rate);

    // update state
    weiRaised = weiRaised.add(weiAmount);

    token.mint(beneficiary, tokens);
    TokenPurchase(msg.sender, beneficiary, weiAmount, tokens);

    forwardFunds();
  }

  // send ether to the fund collection wallet
  // override to create custom fund forwarding mechanisms
  function forwardFunds() internal {
    wallet.transfer(msg.value);
  }

  // @return true if the transaction can buy tokens
  function validPurchase() internal constant returns (bool) {
    bool withinPeriod = now >= startTime && now <= endTime;
    return withinPeriod;
  }

  // @return true if crowdsale event has ended
  function hasEnded() public constant returns (bool) {
    return now > endTime;
  }
 
  // @return exchange rate, Can be overridden to add variable rate logic.
  function getRate() public constant returns(uint256){
    return base_rate;
  }
}