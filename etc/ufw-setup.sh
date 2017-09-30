#!/bin/bash

# Clear all rules & disable firewall
sudo ufw --force reset > /dev/null

# ssh
sudo ufw allow 22 > /dev/null &&\

# http
sudo ufw allow 80 > /dev/null &&\

# https
sudo ufw allow 443 > /dev/null &&\

# chained &&\ means we shouldn't enable the firewall unless
# all of the previous commands succeeded
sudo ufw --force enable > /dev/null

# Let's make sure everything looks good
sudo ufw status

