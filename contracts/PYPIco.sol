pragma solidity ^0.4.19;

import "./FinalizableCrowdsale.sol";
import "./PYPToken.sol";
import './StandardCrowdsale.sol';

contract PYPIco is FinalizableCrowdsale, StandardCrowdsale {


  function PYPIco() public
    StandardCrowdsale()
  {}

  // enable token tranferability
  function enableTokenTransferability() public onlyOwner {
    require(token != address(0));
    token.unpause();
  }

  // disable token tranferability
  function disableTokenTransferability() public onlyOwner {
    require(token != address(0));
    token.pause();
  }

  function changeAddressBlock(address beneficiary, bool isBlocked) public onlyOwner {
    require(token != address(0));
    token.addBlocked(beneficiary, isBlocked);
  }

  // transfer tokens
  function transferTokens(uint256 _value, address beneficiary) public onlyOwner {
    require(token != address(0));
    require(beneficiary != address(0));

    token.mint(beneficiary, _value);

    TokenPurchase(0x0, beneficiary, 0, _value);
  }

  /**
   * finalization logics
   */
  function finalization() internal {
    // disable minting
      token.finishMinting();
      token.unpause();
  }
}