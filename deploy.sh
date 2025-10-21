#!/bin/bash

# Azure App Service Deployment Script
# This script runs during deployment to prepare the application

echo "Starting deployment script..."

# Navigate to backend directory
cd backend

# Install production dependencies only
echo "Installing backend production dependencies..."
npm ci --only=production

echo "Deployment script completed successfully!"
