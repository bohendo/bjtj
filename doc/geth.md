
# Geth

# Key Resources
 - [Ethereum Whitepaper](https://github.com/ethereum/wiki/wiki/White-Paper)
 - [Frontier Guide](https://ethereum.gitbooks.io/frontier-guide/index.html)
 - [Homestead Docs](http://www.ethdocs.org/en/latest/)

# Installation

I installed geth by following the [Official Installation Instructions for Ubuntu](https://github.com/ethereum/go-ethereum/wiki/Installation-Instructions-for-Ubuntu) aka I ran these 4 lines:

```bash
sudo apt-get install software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum
```

# Syncing geth with the main network

Installing geth is the easy part, syncing it is where things get interesting. I'm on a digital ocean droplet so don't have nearly as much RAM as some state-of-the-art desktop computer. Running `geth` without enough memory will summon the ruthless [OOM killer](https://lwn.net/Articles/317814/) which kills memory gluttons with impunity and without giving them time to clean up properly.

[Peter synced geth on only 512Mb RAM!](https://hackernoon.com/how-to-run-geth-at-512mb-ram-digital-ocean-droplet-e346986cf666) Let's take a page out of his book and set up some swap space to ensure geth is protected from the OOM killer.

Swap space is a chunk of our hard drive that our OS will pretend is RAM. This makes our memory appear bigger but anytime we overflow our real RAM and start using our hard drive as "RAM," things will slow down tremendously. If we're using a SSD, things will be quicker but **beware**: SSDs don't handle frequent writes very well and will wear out much more quickly if we use them like RAM. Digital Ocean is all SSD so [their swap documentation](https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-16-04) warns against using swap on their platform. I'm assuming that geth will utilize swap memory during it's initial sync and then slow down it's memory usage to stay up to date so I will disregard this warning for now..

```bash
# create a file & allocate 4GB to it
sudo fallocate -l 4G /swp

# Lots of sensitive stuff like passwords end up in RAM
# Since this file will store RAM info, make sure it's locked down
sudo chmod 600 /swp

# tell the kernel that this file is intended to be used as swap space
sudo mkswap /swp

# tell the kernel to start using /swp as swap space
sudo swapon /swp

# lower swappiness numbers mean 'be reluctant to use swap'
# Default is 60 but to spare DO's SSDs, let's lower this a little
sudo sysctl vm.swappiness=30

# Check to make sure your swap looks good
sudo swapon --show
free -h
```

And now we can begin.

```bash
# use 16 MB for cache (default is 128 MB) this is the minimum allowed
geth --syncmode fast --cache 16
```

