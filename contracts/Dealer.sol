pragma solidity ^0.4.0;

contract Dealer {

    // TODO: Add an address=>info mapping
    // add signup function that creates a new "dealer"
    // style account with deposit/cashout events that
    // the bjtj frontend connects to & backend listens for
    // events are per dealer accout, gotta specify which dealer 
    // when depositing too. Ideally dealers couldn't cashout to
    // themselves but I see no way to enforce that..

    address public pitboss;
    uint public constant ceiling = 0.25 ether;

    event Deposit(address indexed _from, uint _value);

    function Dealer() public {
      pitboss = msg.sender;
    }

    function () public payable {
      Deposit(msg.sender, msg.value);
    }

    modifier pitbossOnly {
      require(msg.sender == pitboss);
      _;
    }

    function cashout(address winner, uint amount) public pitbossOnly {
      // are cashout events worth it?
      winner.transfer(amount);
    }

    function overflow() public pitbossOnly {
      require (this.balance > ceiling);
      pitboss.transfer(this.balance - ceiling);
    }

    function kill() public pitbossOnly {
      selfdestruct(pitboss);
    }

}
