#! /bin/sh
if [ ! -e /var/swapfile ]
then
  sudo /bin/dd if=/dev/zero of=/var/swapfile bs=1M count=2048 &&
    sudo /bin/chmod 600 /var/swapfile &&
    sudo /sbin/mkswap /var/swapfile &&
    sudo /sbin/swapon /var/swapfile
else
  echo "Nothing to do - swap has been initialized earlier!"
fi
