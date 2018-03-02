pragma solidity ^0.4.19;

import './StandardToken.sol';
import '../ownership/Ownable.sol';

/**
 * @title Blockable Token
 * @dev This is an extension to add blocklist
 *
 */
contract BlockableToken is StandardToken, Ownable {
	
	mapping(address=>bool) public blockeds;

	event WalletBlocked(address target, bool isBlocked);

	/**
     * @dev Add Address for disabled transfer tokens
     * @param target Address that will be blocked/unblocked.
     * @param isBlocked Status of address.
     */
    function addBlocked(address target, bool isBlocked) onlyOwner public returns (bool){
        blockeds[target] = isBlocked;
        WalletBlocked(target, isBlocked);
        return true;
    }


    /**
    * @dev Modifier to make a function callable only when the address is not blocked.
    */
    modifier whenNotBlocked(address target) {
        require(!blockeds[target]);
        _;
    }

}