
# Linux Firewalls

Some notes on netfilter, iptables, and firewall best practices

## Resources
 - [How iptables works](https://www.digitalocean.com/community/tutorials/how-the-iptables-firewall-works) (1k words)
 - [How Linux Works](https://www.amazon.com/How-Linux-Works-2nd-Superuser/dp/1593275676) (200k words)

### Glossary

 - netfilter is a framework provided by the linux kernel that provides functions for filtering and routing the packets that pass through it's network interfaces.

 - iptables is a command line tool for interacting with the kernel's IPv4 netfilter. Warning: there is a completely separate netfilter for IPv6 traffic that's similarly controlled by ip6tables. There's a tool called ufw tool that's just a wrapper around iptables and ip6tables but with slightly simpler syntax.

 - A rule is an action to take if some matching criteria is met.
   - some example actions: accept packet, drop it, move it to another chain, log it, etc
   - some example matching criteria: protocol type, source ip, destination port, interface, previous packets, etc

 - A chain is a set of rules that are applied sequentially. Order matters. If any rule of a chain matches, that action is taken and the rest of the rules in the chain are ignored. Make sure your rules are ordered from specific to general.

 - A chain's policy is the default action it takes if none of it's rules match a packet.

 - There are three built-in chains:
   - INPUT: handles all packets destined for this machine
   - FORWARD: handles all packets destined for another machine
   - OUTPUT: handles all packets originating from this machine

## Setup

```bash

sudo ufw allow OpenSSH && sudo ufw enable

```


