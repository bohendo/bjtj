pragma solidity ^0.4.21;

contract thePit {

    // Just a first crack at it. 
    
    // TODO: Add an address=>info mapping
    // only info is the dealers address mapped to their balance
    
    // add signup function that creates a new "dealer"
    // There is no need for a dealer to sign up.  
    // The transaction call linked on their webpage will deposit it into thier account.
    // They transfer eth with a deposit to start their bank roll.
    
    // style account with deposit/cashout events that
    // modified deposit, created cashout and overflow events
    
    // the bjtj frontend connects to & backend listens for
    // events are per dealer account, gotta specify which dealer 
    // DONE for the contract
    
    // when depositing too. Ideally dealers couldn't cashout to
    // themselves but I see no way to enforce that..
    // Agree

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
