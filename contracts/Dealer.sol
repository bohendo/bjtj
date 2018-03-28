pragma solidity ^0.4.21;

contract Dealer {

    // TODO: Isolate magic numbers:
    //   pitboss cut ie 10%
    //   overflow margin ie 0.1 ether or maybe instead something like:
    //     overflow_top = 0.35 and overflow_bottom = 0.25?
    //   maybe others?

    // We might want to edit some of these magic numbers after deployment too..
    // A function allowing the pitboss to raise/lower the ceiling might be useful

    // It would be awesome to abstract out a single overflow function and then
    //   use it both as a standalone method & in cashout (and maybe deposit?)

    // Also, we gotta write some tests before deploying!

    address public pitboss;
    uint256 public constant ceiling = 0.25 ether;

    mapping(address => uint256) public bankrolls;
    
    event Deposit(address indexed _dealer, address indexed _depositor, uint _amount);
    event Cashout(address indexed _dealer, address indexed _winner, uint _amount);
    event Overflow(address indexed _dealer, uint256 _dealerAmount, address indexed _pitboss, uint256 _pitbossAmount);

    function thePit() public {
      pitboss = msg.sender;
    }

    function deposit(address _dealer) public payable {
      bankrolls[_dealer] = bankrolls[_dealer] + msg.value;
      emit Deposit(_dealer, msg.sender, msg.value);
    }

    modifier onlyBy(address _address) {
      require(msg.sender == _address);
      _;
    }

    function cashout(address winner, uint amount) public {
      require(amount <= ceiling);
      uint256 dealerBankroll = bankrolls[msg.sender];
      require(dealerBankroll >= amount);
      if(dealerBankroll >= ceiling + 0.1 ether){
        bankrolls[msg.sender] = dealerBankroll - ceiling;
        msg.sender.transfer((dealerBankroll - ceiling) * 9 / 10);
        pitboss.transfer((dealerBankroll - ceiling) / 10);
        emit Overflow(msg.sender, (dealerBankroll - ceiling) * 9 / 10, pitboss, (dealerBankroll - ceiling) / 10);
      }
      bankrolls[msg.sender] =- amount;
      winner.transfer(amount);
      emit Cashout(msg.sender, winner, amount);
    }

    function manualOverflow(address _dealer) public onlyBy(pitboss) {
      uint256 dealerBankroll = bankrolls[_dealer];
      require (dealerBankroll >= ceiling + 0.1 ether);
      bankrolls[msg.sender] =- dealerBankroll - ceiling;
      pitboss.transfer((dealerBankroll - ceiling) / 10);
      _dealer.transfer((dealerBankroll - ceiling) * 9 / 10);
      emit Overflow(msg.sender, (dealerBankroll - ceiling) * 9 / 10, pitboss, (dealerBankroll - ceiling) / 10);
    }

    function kill() public onlyBy(pitboss) {
      selfdestruct(pitboss);
    }

}
