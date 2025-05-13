#!/bin/bash
set -e

if systemctl -q is-active web.service; then
    echo "App is running, stopping."
    sudo systemctl stop web.service
    # Disable App to start on boot
    sudo systemctl disable web.service
fi

SCRIPT_DIR="/var/app/current/.platform/hooks/predeploy"

# Find all .sh files and execute them
for script in "$SCRIPT_DIR"/*.sh; do
    if [ -f "$script" ]; then
        echo "Running $script..."
        chmod +x "$script"  # Ensure the script is executable
        "$script"           # Execute the script
    fi
done
