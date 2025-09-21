from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Query
import logging

from services.spotify_service import get_access_token
from services.spotify_service import get_top_tracks
from services.spotify_service import check_spotify_status
from models.fastapi_models import SpotifyStatusResponse, SpotifyCallbackResponse, TopTracksResponse

# Create FastAPI instance
app = FastAPI(
    title="Isoca Spot API",
    description="API for observing music data with Spotify",
    version="1.0.0",
)

# Configure CORS - only allow the frontend origins explicitly so headers are applied correctly
FRONTEND_ORIGINS = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
]

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = logging.getLogger("uvicorn.error")

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to Isoca Spot API", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "isoca-spot-api"}

@app.get("/api/spotify/status", response_model=SpotifyStatusResponse)
async def spotify_status(access_token: str = None):
    """Check Spotify API connection status"""
    if access_token:
        connected, message = check_spotify_status(access_token)
        return {
            "spotify_connected": connected,
            "message": message,
            "next_steps": "Provide a valid access token if not connected."
        }
    else:
        return {
            "spotify_connected": False,
            "message": "No access token provided.",
            "next_steps": "Authenticate with Spotify to obtain an access token."
        }


@app.get("/api/spotify/callback", response_model=SpotifyCallbackResponse)
async def spotify_callback(code: str = Query(None)):
    """Exchange authorization code for an access token."""
    if not code:
        raise HTTPException(status_code=400, detail="Missing 'code' query parameter")

    try:
        access_token = get_access_token(code)
        if not access_token:
            raise HTTPException(status_code=500, detail="Failed to obtain access token from Spotify")
        return {"access_token": access_token, "message": "Spotify authentication successful"}
    except HTTPException:
        # re-raise HTTPExceptions from above
        raise
    except Exception as e:
        logger.exception("Error handling spotify callback")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/spotify/top-tracks", response_model=TopTracksResponse)
async def top_tracks(access_token: str):
    try:
        tracks = get_top_tracks(access_token)
        # Convert tracks to Track models if needed
        return {"top_tracks": tracks}
    except Exception as e:
        logger.exception("Error fetching top tracks")
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)