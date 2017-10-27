pragma solidity 0.4.15;

import "./StandardCrowdsale.sol";
import './ownership/Ownable.sol';

/**
 * @title WhitelistedCrowdsale
 * @dev This is an extension to add whitelist to a crowdsale
 *
 */
contract WhitelistedCrowdsale is StandardCrowdsale, Ownable {
    
    mapping(address=>bool) public registered;

    event RegistrationStatusChanged(address target, bool isRegistered);

    /**
     * @dev Changes registration status of an address for participation.
     * @param target Address that will be registered/deregistered.
     * @param isRegistered New registration status of address.
     */
    function changeRegistrationStatus(address target, bool isRegistered)
        public
        onlyOwner
    {
        registered[target] = isRegistered;
        RegistrationStatusChanged(target, isRegistered);
    }

    /**
     * @dev Changes registration statuses of addresses for participation.
     * @param targets Addresses that will be registered/deregistered.
     * @param isRegistered New registration status of addresses.
     */
    function changeRegistrationStatuses(address[] targets, bool isRegistered)
        public
        onlyOwner
    {
        for (uint i = 0; i < targets.length; i++) {
            changeRegistrationStatus(targets[i], isRegistered);
        }
    }

    /**
     * @dev overriding Crowdsale#validPurchase to add whilelist
     * @return true if investors can buy at the moment, false otherwise
     */
    function validPurchase() internal constant returns (bool) {
        return super.validPurchase() && registered[msg.sender];
    }
}
