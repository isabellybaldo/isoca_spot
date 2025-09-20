from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create FastAPI instance
app = FastAPI(
    title="Isoca Spot API",
    description="API for observing music data with Spotify",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to Isoca Spot API", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "isoca-spot-api"}

@app.get("/api/spotify/status")
async def spotify_status():
    """Check Spotify API connection status"""
    # TODO: Implement actual Spotify API connection check
    return {
        "spotify_connected": False,
        "message": "Spotify integration not yet implemented",
        "next_steps": "Configure Spotify API credentials"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)