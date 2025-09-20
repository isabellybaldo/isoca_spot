from pydantic import BaseModel
from typing import List, Optional


class SpotifyStatusResponse(BaseModel):
    spotify_connected: bool
    message: str
    next_steps: str


class SpotifyCallbackResponse(BaseModel):
    access_token: Optional[str]
    message: str

class Track(BaseModel):
    name: str
    artists: list
    popularity: int
    genres: list


class TopTracksResponse(BaseModel):
    top_tracks: List[Track]