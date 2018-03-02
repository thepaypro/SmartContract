pragma solidity ^0.4.11;

import './PYPToken.sol';
import './math/SafeMath.sol';

/**
 * @title Crowdsale
 * @dev Crowdsale is a base contract for managing a token crowdsale.
 */

contract StandardCrowdsale{
  using SafeMath for uint256;

  // The token being sold
  PYPToken public token;

  /**
   * event for token purchase logging
   * @param purchaser who paid for the tokens
   * @param beneficiary who got the tokens
   * @param value weis paid for purchase
   * @param amount amount of tokens purchased
   */
  event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

  function StandardCrowdsale() {
    token = createTokenContract(); 
  }

  // creates the token
  function createTokenContract() internal returns (PYPToken) {
    return new PYPToken();
  }

}