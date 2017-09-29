
# Computer Networking Glossary

### Last updated on Aug 24th, 2017 by Bo Henderson

# Terms

 - Network interface: Connection between networking hardware and software. Maintained by the linux kernel. They are given names like `eth0` and `wlan0` for ethernet and wireless interfaces respectively.
 - localhost: loopback interface to talk to the machine you're currently using. ip address: 127.0.0.1
 - router: a computer with more than one physical network interface.
 - ip masquerading: The most common variant of NAT where the router acts as a middle man between a host on it's subnet and some server on the internet.
 - ipv4: version 4 of the internet protocol. Has an address space of 2^32 (about 4 billion) which isn't enough to cover all internet-connected devices (about 8 billion). Hacky fixes like NAT are being used to stretch this address space while we migrate to ipv6.
 - ipv6: version 6 of the internet protocol. Has an address space of 2^128 which is more than enough to assign a unique ipv6 address to every internet-connected device well into the future.
 - Firewall: Filters out "bad" internet traffic. Can be performed by a router to protect it's entire subnet or by an individual machine (called ip filtering in this case).
 - Chain: a series of firewall rules applied in sequence. Each chain has a "policy" aka a default action to take if we reach the end of the chain without making an explicit decision. Decisions and policies are one of ALLOW or DROP.

# Acronyms

 - CIDR (Classless Inter-Domain Routing): A more succinct way of representing subnet masks. It provides the number of leading bits that define the static part of a subnet of ip addresses (ie 24) instead of a mask (ie 255.255.255.0). Both of these assume an ip prefix supplies the first 3 bytes of info and that the last byte varies to unique identify each ip address.
 - HTTP (HyperText Transfer Protocol): Application layer protocol that drives the web
 - SSL (Secure Socket Layer): Application layer protocol
 - FTP (File Transfer Protocol): Application layer protocol for transfering files. Textbook example of an insecure service.
 - TCP (Transmission Control Protocol): Connection-driven transport layer protocol. Imagine making a digital phone call. Connects a specific port of one computer to some port of another.
 - UDP (User Datagram Protocol): Message-driven transport layer protocol. Imagine sending a peice of digital mail.
 - ICMP (Internet Control Message Protocol): Used by routers to send control messages (ie errors or redirections) rather than actual data
 - DNS (Domain Name System): Responsible for translating domain names (eg www.google.com) into ip addresses (eg 172.217.3.164)
 - IP (Internet Protocol): Protocol for delivering data packets to the appropriate ip address.
 - MAC (Media Access Control): Hardware address, independent from an ip address and unique to our ethernet network.
 - NTP (Network Time Protocol): UDP protocol for asking "What time is it?"
 - DHCP (Dynamic Host Configuration Protocol): Automatically configures hosts with the appropriate ip address, netmask, dns servers, etc. Most routers also act as DHCP servers.
 - NAT (Network Address Translation): Translates ip addresses used locally within a subnet to an ip address address understood by the entire internet. NAT is a hack used to extend the ipv4 address space and won't be needed if/when we completely migrate to ipv6.
 - ARP (Address Resolution Protocol): System for matching MAC addresses to ip addresses within local subnets.
 - SSID (Service Set IDentifier): the name of your wifi network
 - WPA (Wifi Protected Access): Method of authentication, also available as a new and improved version 2 (ie WPA2).
 - VPN (Virtual Private Network): 

# Command Line Tools

 - ifconfig: used to display and configure our network interfaces (eg provides our ip address, etc)
 - ip: modern replacement for older tools like ifconfig and routes.
 - iptables: provides access to low-level firewall configuration. Use the -L option to list rules.
 - ufw: provides higher-level but equally powerful access to firewall configuration
 - route: provides access to the kernel's routing table. No args: display the table or your can use commands like `add` or `del` to modify it.
 - ping: Used to text whether we can connect to a given host by sending an ICMP echo request. Displays the number of successful echos recieved and how long they took to make the round trip.
 - traceroute: Sends a packet to a given host and prints out each jump this packet makes in it's journey along with how long each one took.
 - netstat: get the stats on our current network connections. -t option limits output to tcp.
 - sysctl: used to view or modify kernel parameters. view with option -a or load parameters from `/etc/sysctl.conf` with option -p.
 - iw: interface to the machine's wireless network interface. Use `iw dev wlan0 scan` to scan the wireless network interface called wlan0 (check ifconfig, your interface might have a different name) for available connections. Use `iw dev wlan0 link` to get the details about your current wifi connection.

# Files of interest

 - /etc/sysctl.conf: configuration file for updating kernel parameters. Load any changes you make using `sysctl -p`.
 - /etc/hosts: contains a list of ip-domain pairs where the ip is an ipv4 or ipv6 address (eg 127.0.0.1) and the domain is it's domain name (eg localhost). While resolving domain names into ip addresses, this file is checked before a DNS query is made.
 - /etc/services: contains a list of service-port pairs where the service is the name of a service (eg ssh) and the port is a number/protocol (ie 22/tcp). Good place to check whether some port is considered "well-known".
 - /etc/resolv.conf: lists the ip addresses of available name servers

