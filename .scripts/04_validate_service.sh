#!/bin/bash

# Test NGINX configuration
if sudo nginx -t; then
    echo "NGINX configuration is valid."
else
    echo "NGINX configuration is invalid. Please check for errors."
    exit 1
fi

# Check if the Nginx is running
if systemctl -q is-active nginx; then
    echo "NGINX is running."
else
    echo "NGINX is not running."
    exit 1
fi

# Check if the App is running
if systemctl -q is-active web.service; then
    echo "App is running."
    exit 0
else
    echo "App is not running."
    exit 1
fi
