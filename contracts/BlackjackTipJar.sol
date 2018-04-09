pragma solidity ^0.4.21;

contract BlackjackTipJar {

    address public pitboss;
    uint256 public deployedOn;

    uint8 public dealer_cut = 95; // percent
    uint256 public overflow_upper = 0.35 ether;
    uint256 public overflow_lower = 0.25 ether;

    mapping(address => uint256) public bankrolls;
    
    event Deposit(address indexed _dealer, address indexed _from, uint _value);
    event Cashout(address indexed _dealer, address indexed _to, uint _value);
    event Overflow(address indexed _dealer, uint256 _value);

    modifier auth() {
      require(msg.sender == pitboss);
      _;
    }

    function BlackjackTipJar() public payable {
      pitboss = msg.sender;
      deployedOn = block.number;
      bankrolls[pitboss] = msg.value;
    }

    function () public payable {
      bankrolls[pitboss] += msg.value;
      // TODO: Overflow here too?
    }

    function deposit(address dealer) public payable {
      bankrolls[dealer] = bankrolls[dealer] + msg.value;
      emit Deposit(dealer, msg.sender, msg.value);

      // Has our cup runneth over? Let's collect our profits
      uint256 dealerBankroll = bankrolls[dealer];
      if (dealerBankroll > overflow_upper) {

        uint256 overflow_amt = dealerBankroll - overflow_lower;
        uint256 dealer_payout = overflow_amt * dealer_cut / 100;

        bankrolls[dealer] -= overflow_amt;
        // TODO: Don't split these transfers up if dealer == pitboss
        dealer.transfer(dealer_payout);
        pitboss.transfer(overflow_amt - dealer_payout);
        emit Overflow(dealer, dealer_payout);
      }

    }

    function cashout(address winner, uint amount) public {
      uint256 dealerBankroll = bankrolls[msg.sender];
      uint256 value;
      if (amount > dealerBankroll) {
        value = dealerBankroll;
      } else {
        value = amount;
      }
      bankrolls[msg.sender] -= value;
      winner.transfer(value);
      emit Cashout(msg.sender, winner, value);
    }

    function setDealerCut(uint8 cut) public auth {
      require(cut <= 100 && cut >= 1);
      dealer_cut = cut;
    }

    function setOverflowBounds(uint256 upper, uint256 lower) public auth {
      require(lower > 0 && upper > lower);
      overflow_upper = upper;
      overflow_lower = lower;
    }

    function kill() public auth {
      selfdestruct(pitboss);
    }

}
