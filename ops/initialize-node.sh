#!/bin/bash

# Go to digitalocean and create a new Docker node
# Make sure you add ssh keys. If you don't have any, generate them with:
# ssh-keygen -t rsa -b 4096 -C "name@example.com"

# Once your droplet's awake & your ssh keys are good to go,
# Run this script and pass the droplet's IP as the first & only argument

# define a clean error handler
function err { >&2 echo "Error: $1"; exit 1; }

# Sanity check, were we given an IP?
if [[ ! $1 || $2 ]]
then
  err "Provide droplet's IP as the first & only arg"
fi
IP=$1

# Check our given IP and the default ssh credentials
ssh -q root@$IP exit
if [[ $? -ne 0 ]]
then
  err "Couldn't open an ssh connection to root@$IP"
fi

hostname=`ssh root@$IP hostname`
internal_ip=`ssh root@$IP ifconfig eth1 | grep 'inet addr' | awk '{print $2;exit}' | sed 's/addr://'`

####################
# Begin main heredoc
ssh root@$IP "bash -s" <<EOF

########################################
# Upgrade Everything

# update & upgrade without prompts
# https://askubuntu.com/questions/146921/how-do-i-apt-get-y-dist-upgrade-without-a-grub-config-prompt
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" dist-upgrade

########################################
# Install Docker

# Make sure no old versions are installed
apt-get remove -y docker docker-engine docker.io

# Install dependencies
apt-get install -y apt-transport-https ca-certificates curl software-properties-common

# Get the docker team's official gpg key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

# Add the docker repo
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

apt-get update -y
apt-get install -y docker-ce=17.09.0~ce-0~ubuntu

docker swarm init --advertise-addr $internal_ip 2> /dev/null

########################################
# Setup git repo & deployment machine

if ! getent passwd git
then
  adduser --disabled-password --gecos "" git
  usermod -aG docker git
  cp -vr /root/.ssh /home/git/.ssh
fi

mkdir -vp /var/git/bjvm
mkdir -vp /var/git/bjvm.git

cd /var/git/bjvm.git

if [[ ! -d hooks ]]
then
  git init --bare

  tee hooks/post-receive <<EOIF
#!/bin/bash
git --work-tree=/var/git/bjvm --git-dir=/var/git/bjvm.git checkout -f
cd /var/git/bjvm
docker stack deploy -c docker-compose.yml bjvm
EOIF

fi

chmod -v 755 hooks/post-receive
chown -vR git:git /var/git
chown -vR git:git /home/git


########################################
# Double-check upgrades & reboot

## For some reason, gotta upgrade multiple times to get it all
apt-get update -y && apt-get upgrade -y && apt-get autoremove -y
apt-get update -y && apt-get upgrade -y && apt-get autoremove -y

## Remove that silly motd
rm -rf /etc/update-motd.d/99-one-click

echo "Restarting remote server..."
sleep 3 && reboot &
exit

EOF

# Add a remote git repo to push to
git remote remove $hostname 2> /dev/null
git remote add $hostname ssh://git@$IP:/var/git/bjvm.git

# Add this host to our ssh/config
if ! grep $hostname ~/.ssh/config
then
  echo "Updating ~/.ssh/config.."
  echo | tee -a ~/.ssh/config
  echo "Host $hostname" | tee -a ~/.ssh/config
  echo "  Hostname $IP" | tee -a ~/.ssh/config
  echo "  User root" | tee -a ~/.ssh/config
  echo "  IdentityFile ~/.ssh/id_rsa" | tee -a ~/.ssh/config
fi

echo;
echo "If you didn't see any errors above, we're good to go."
echo "  ssh to your droplet with: ssh $hostname"

