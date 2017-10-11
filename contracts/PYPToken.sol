import './ownership/Ownable.sol';
import './token/PausableToken.sol';
import './token/MintableToken.sol';

/**
 * @title The PYPToken contract
 * @dev The PYP Token contract
 * @dev inherite from PausableToken and Ownable by Zeppelin
 * @author kkx 
 */
contract PYPToken is MintableToken, PausableToken, Ownable {
    string  public  constant name = "PYP Token";
    string  public  constant symbol = "PYP";
    uint8   public  constant decimals = 18;

    function PYPToken() {
        //Set token transfer paused
        paused = true;
    }
}
