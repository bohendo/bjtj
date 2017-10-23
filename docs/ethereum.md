
# Ethereum

## Basics

2 Types of accounts:
 - normal accounts are defined by a public key and are controlled by it's private key
 - contract accounts are defined by the hash of their signature and are controlled by a snippet of code that takes incoming transactions as input.

## Build a private testnet blockchain

Installation:

```bash
# https://github.com/ethereum/go-ethereum/wiki/Installation-Instructions-for-Ubuntu
sudo apt-get install software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum
```

Genesis block:

```javascript
{
    "nonce": "0x0000000000000042",     "timestamp": "0x0",   "config": { },
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "extraData": "0x00",     "gasLimit": "0x8000000",     "difficulty": "0x100",
    "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "coinbase": "0x3333333333333333333333333333333333333333",
    "alloc": { "0x3e817d5802b734e318d30048832e70769cb839a3": { "balance": "20000000000000000000"  } }
}
```

tgeth.sh:

```bash
#!/bin/bash

geth --identity "bohendo"               \
     --networkid 3993                   \
     --datadir "~/d/testnet"            \
     --port "30304"                     \
     --rpc                              \
     --rpcport "8080"                   \
     --rpccorsdomain "http://localhost" \
     --rpcapi "db,eth,net,web3" "$@"
```

Setting up a new testnet:

```bash
personal.newAccount()
# supply password & confirmation

miner.setEtherbase(eth.accounts[0])

```
