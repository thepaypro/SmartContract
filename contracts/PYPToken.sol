pragma solidity ^0.4.19;


import './ownership/Ownable.sol';
import './token/PausableToken.sol';
import './token/MintableToken.sol';

/**
 * @title The PYPToken contract
 * @dev The PYP Token contract
 * @dev inherite from PausableToken and Ownable by Zeppelin
 * @author kkx 
 */

contract PYPToken is MintableToken, PausableToken{
    string  public  constant name = "PIP Token";
    string  public  constant symbol = "PIP";
    uint8   public  constant decimals = 18;

    function PYPToken() {
        //Set token transfer paused
        paused = true;
    }
}
