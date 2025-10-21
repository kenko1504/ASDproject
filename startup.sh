#!/bin/bash

# Azure App Service Startup Script
# This script runs when the container starts

echo "Starting application..."

# Set Node environment to production
export NODE_ENV=production

# Navigate to backend directory and start the server
cd /home/site/wwwroot/backend
node server.js
