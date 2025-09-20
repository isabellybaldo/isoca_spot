#!/bin/bash

# Isoca Spot Development Server Starter
# This script helps you start both the backend and frontend servers

set -e

echo "🎵 Starting Isoca Spot Development Environment"
echo "=============================================="

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8+ to continue."
    exit 1
fi

echo "✅ Python is available"

# Navigate to backend directory and check dependencies
echo "📦 Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "🔨 Creating virtual environment..."
    python -m venv venv
fi

echo "🔄 Activating virtual environment..."
source venv/bin/activate

echo "📥 Installing dependencies..."
pip install -r requirements.txt

echo "🚀 Starting FastAPI backend on http://localhost:8000"
echo "   API Documentation: http://localhost:8000/docs"
echo "   Health Check: http://localhost:8000/health"
echo ""
echo "⚠️  Keep this terminal open and start the frontend in another terminal"
echo "   To start frontend: cd frontend && python -m http.server 3000"
echo ""

# Start the backend server
python main.py