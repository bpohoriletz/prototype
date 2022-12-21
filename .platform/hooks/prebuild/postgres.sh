#! /bin/sh
sudo yum install amazon-linux-extras &&
  sudo amazon-linux-extras enable postgresql14 &&
  sudo yum install -y postgresql-devel
