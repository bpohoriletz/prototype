#!/bin/bash
set -e

SCRIPT_DIR="/var/app/current/.platform/hooks/prebuild"

# Find all .sh files and execute them
for script in "$SCRIPT_DIR"/*.sh; do
    if [ -f "$script" ]; then
        echo "Running $script..."
        chmod +x "$script"  # Ensure the script is executable
        "$script"           # Execute the script
    fi
done

# Configure application settings
# (e.g., update configuration files, set permissions)
# Navigate to the application directory
cd /var/app/current
# Install gems
bin/bundle
# Compile assets
RAILS_ENV=production bin/bundle exec rails assets:precompile

# Reload NGINX to apply possible conf changes
sudo nginx -s reload

# Enable App to start on boot
sudo systemctl enable web.service

SCRIPT_DIR="/var/app/current/.platform/hooks/postdeploy"

# Find all .sh files and execute them
for script in "$SCRIPT_DIR"/*.sh; do
    if [ -f "$script" ]; then
        echo "Running $script..."
        chmod +x "$script"  # Ensure the script is executable
        "$script"           # Execute the script
    fi
done
