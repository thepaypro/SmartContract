pragma solidity ^0.4.15;

import "./FinalizableCrowdsale.sol";
import "./PYPToken.sol";

contract PYPIco is FinalizableCrowdsale {


  function PYPIco()
    StandardCrowdsale()
  {}

  function createTokenContract() internal returns (PYPToken) {
    return new PYPToken();
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

  function changeAddressBlock(address beneficiary, bool isBlocked) onlyOwner {
    token.addBlocked(beneficiary, isBlocked);
  }

  // transfer tokens
  function transferTokens(uint256 _value, address beneficiary) onlyOwner {
    require(beneficiary != address(0));

    token.mint(beneficiary, _value);

    TokenPurchase(0x0, beneficiary, 0, _value);
  }

  

  /**
   * finalization logics, mint fundation tokens proportionally to currently minted amount
   */
  function finalization() internal {
    // disable minting
      token.finishMinting();
      token.unpause();
  }
}