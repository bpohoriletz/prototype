#!/bin/bash
set -e

# Function to check if a package is available
is_installed() {
    rpm -q "$1" &>/dev/null
}

# Function to check if a service is active
is_active() {
    systemctl is-active --quiet "$1"
}

# Update package lists
sudo dnf update -y

if is_installed cronie; then
    echo "Cronie is available."
else
    # Install cronie
    sudo dnf install -y cronie
    sudo systemctl enable --now crond
fi

if is_active nginx; then
    echo "Nginx is running."
else
    echo "Nginx is not running."
    # Install Nginx
    sudo dnf install nginx -y

    # Start Nginx
    sudo systemctl start nginx

    # Enable Nginx to start on boot
    sudo systemctl enable nginx
fi

# Delete the old  directory as needed.
if [ -d /var/app/current ]; then
    rm -rf /var/app/current/
fi

# Dev libraries
sudo dnf groupinstall -y "Development Tools"
sudo dnf install -y ruby ruby-devel
