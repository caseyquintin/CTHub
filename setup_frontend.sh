#!/bin/bash

# Navigate to the frontend directory
cd "$(dirname "$0")/CTS/Frontend"

# Install Node.js dependencies
npm install

# Create .env file for API URL configuration
echo 'REACT_APP_API_URL=https://localhost:7243/api' > .env

echo "Frontend dependencies installed. Run 'npm start' in the CTS/Frontend directory to start the development server."