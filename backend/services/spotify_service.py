import requests
from spotipy.oauth2 import SpotifyOAuth
from backend.env import (
    SPOTIPY_CLIENT_ID,
    SPOTIPY_CLIENT_SECRET,
    SPOTIPY_REDIRECT_URI,
    SPOTIPY_SCOPE,
)

def get_spotify_oauth():
    return SpotifyOAuth(
        client_id=SPOTIPY_CLIENT_ID,
        client_secret=SPOTIPY_CLIENT_SECRET,
        redirect_uri=SPOTIPY_REDIRECT_URI,
        scope=SPOTIPY_SCOPE,
    )


def get_access_token(code):
    sp_oauth = get_spotify_oauth()
    token_info = sp_oauth.get_access_token(code)
    return token_info.get("access_token")


def get_top_tracks(access_token):
    url = "https://api.spotify.com/v1/me/top/tracks"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    data = response.json()
    tracks = []
    artist_ids = {artist["id"] for track in data.get("items", []) for artist in track["artists"]}

    # Fetch artist genres in bulk
    artists_url = f"https://api.spotify.com/v1/artists?ids={','.join(artist_ids)}"
    artists_response = requests.get(artists_url, headers=headers)
    artists_response.raise_for_status()
    artists_data = artists_response.json()
    artist_genre_map = {artist["id"]: artist.get("genres", []) for artist in artists_data.get("artists", [])}

    for track in data.get("items", []):
        genres = []
        for artist in track["artists"]:
            genres.extend(artist_genre_map.get(artist["id"], []))
        # Get Spotify link and smallest image
        spotify_link = track["external_urls"]["spotify"]
        smallest_image_url = track["album"]["images"][-1]["url"] if track["album"].get("images") else None
        tracks.append({
            "name": track["name"],
            "artists": [artist["name"] for artist in track["artists"]],
            "popularity": track["popularity"],
            "genres": list(set(genres)),  # Remove duplicates
            "spotify_link": spotify_link,
            "image_url": smallest_image_url
        })
    return tracks


def check_spotify_status(access_token):
    """Check Spotify API connectivity using the access token."""
    url = "https://api.spotify.com/v1/me"
    headers = {"Authorization": f"Bearer {access_token}"}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return True, "Spotify API is reachable."
    except Exception as e:
        return False, str(e)