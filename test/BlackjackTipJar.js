var BlackjackTipJar = artifacts.require('./BlackjackTipJar.sol')

const msg = (tag, actual, expected) => {
  return `[${tag}] got [${typeof actual}] ${actual} but expected [${typeof expected}] ${expected}`
}

contract('BlackjackTipJar', function (accounts) {

  // Define some constants used across all tests

  var BN = web3.BigNumber

  var five = new BN(web3.toWei(0.05,'ether'));
  var alot = new BN(web3.toWei(1.00,'ether'));
  var pitboss = accounts[0] // determined by migrations/2_...
  var dealer1 = accounts[1]
  var dealer2 = accounts[2]


  it(`should add a deposit to a dealer's bankroll`, ()=>{
    var bjtj;
    return BlackjackTipJar.deployed().then(instance=>{
      bjtj = instance;
      return bjtj.deposit(dealer1, { from: dealer2, value: five })
    }).then(receipt=>{
      return bjtj.bankrolls(dealer1)
    }).then(dealer_balance=>{
      assert(dealer_balance.eq(five), msg('dealer bankroll', dealer_balance, five))
    })
  })


  it(`should add random payments to the pitboss's bankroll`, ()=>{
    var bjtj;
    return BlackjackTipJar.deployed().then(instance=>{
      bjtj = instance;
      return web3.eth.sendTransaction({
        from: dealer1,
        to: bjtj.address,
        value: five
      })
    }).then(receipt=>{
      return bjtj.bankrolls(pitboss)
    }).then(pitboss_balance=>{
      assert(pitboss_balance.eq(five), msg('pitboss bankroll', pitboss_balance, five))
    })
  })


  it(`should overflow & give the dealer/pitboss their cuts`, ()=>{


    var actual = {}
    var expected = {}
    var bjtj;

    // db for Dealer Balance, pb for Pitboss Balance
    expected.db = web3.eth.getBalance(dealer2)
    expected.pb = web3.eth.getBalance(pitboss)

    // Get pitboss/dealer2 balance before overflowing
    return BlackjackTipJar.deployed().then(instance=>{
      bjtj = instance;

      return bjtj.overflow_lower()
    }).then(lower=>{  
      expected.dealer_bankroll = new BN(lower)
      expected.overflow = alot.sub(lower)

      return bjtj.dealer_cut()
    }).then(cut=>{  
      // dp for Dealer Payout
      expected.dp = expected.overflow.mul(cut).div(100)
      expected.db = expected.db.add(expected.dp)

      // Make a big deposit then cashout 0
      return bjtj.deposit(dealer2, { from: dealer1, value: alot })
    }).then(receipt=>{
      return bjtj.cashout(dealer1, 0, { from: dealer2 })
    }).then(receipt=>{

      // Make sure an Overflow event was emitted
      let events = receipt.logs.filter(l=>l.event === 'Overflow')
      assert(events.length === 1, msg('Overflow emitted', events.length, 1))

      // Make sure the dealer was paid what we expected
      actual.dp = new BN(events[0].args._value);
      assert(expected.dp.eq(actual.dp), msg('dealer payout', expected.dp, actual.dp))

      return bjtj.bankrolls(dealer2)
    }).then(bankroll=>{

      // Make sure the dealer's bankroll is overflow_lower
      assert(bankroll.eq(expected.dealer_bankroll), msg('dealer bankroll', bankroll, expected.dealer_bankroll))

      // Make sure the pitboss received their overflow payment
      actual.pb = web3.eth.getBalance(pitboss)
      expected.pb = expected.pb.add(expected.overflow.sub(expected.dp))
      assert(actual.pb.eq(expected.pb), msg('pitboss balance', actual.pb, expected.pb))
    })
  })


})

