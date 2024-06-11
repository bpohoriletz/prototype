#! /bin/sh
if [ ! -e /var/swapfile ]
then
  /bin/dd if=/dev/zero of=/var/swapfile bs=1M count=1024 &&
    /bin/chmod 600 /var/swapfile &&
    /sbin/mkswap /var/swapfile &&
    /sbin/swapon /var/swapfile
else
  echo "Nothing to do - swap has been initialized earlier!"
fi
