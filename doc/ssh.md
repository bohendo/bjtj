
# Startup

### By Bo Henderson
### Last updated on Sep 18 2017

## Resources
 - [DigitalOcean - Initial Ubuntu 16.04 Setup](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-16-04)

## Setup Script


```bash
```

 3. Create your user & enable user login

```bash
# remote server

adduser bohendo
# enter password then you can hit enter through optional prompts

# add this user to the sudo group
# -a for append, -G for group. 
usermod -aG sudo bohendo

# switch to this user so permissions are set correctly
su - bohendo

# Make sure our public key is in our user's authorized_keys
sudo cp -r /root/.ssh /home/bohendo/.ssh
sudo chown -R bohendo: .ssh
```

 4. Open a new terminal and test user login

```bash
# from client computer
ssh bohendo@165.227.179.26
# Good? Then you can close your other root terminal
```

 5. If user login worked, disable root login

```bash
# remote server
sudo sed -i 's/#\?PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config 
exit
```

 6. Firewalls are good but we need to make sure port 22 doesn't close otherwise we'll be locked out. 

```bash
sudo ufw allow OpenSSH && sudo ufw enable
```

