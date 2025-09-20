#!/bin/bash

# Isoca Spot Frontend Server Starter
# This script starts the frontend development server

echo "🌐 Starting Isoca Spot Frontend"
echo "==============================="

# Navigate to frontend directory
cd frontend

echo "🚀 Starting frontend server on http://localhost:3000"
echo "   Open your browser and go to: http://localhost:3000"
echo ""
echo "⚠️  Make sure the backend is running on http://localhost:8000"
echo "   To start backend: ./start-backend.sh"
echo ""

# Start the frontend server
python -m http.server 3000