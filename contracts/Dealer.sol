pragma solidity ^0.4.0;

contract Dealer {

    address public pitboss;

    uint public constant ethLimit = 1 ether;

    event Deposit(address indexed _from, uint _value);

    function Dealer() public {
      pitboss = msg.sender;
    }

    function overflow() public {
      if (msg.sender == pitboss && this.balance > ethLimit) {
        pitboss.transfer(this.balance - ethLimit);
      }
    }

    function cashout(address winner, uint amount) public {
      if (msg.sender == pitboss) {
        winner.transfer(amount);
      }
    }

    function kill() public {
      if (msg.sender == pitboss) {
        selfdestruct(pitboss);
      }
    }

    function () public payable {
      Deposit(msg.sender, msg.value);
    }
}
