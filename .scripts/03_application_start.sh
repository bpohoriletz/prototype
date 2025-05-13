#!/bin/bash
set -e

# Start the application
sudo systemctl daemon-reload
sudo systemctl start web.service
echo "web.service is running"
