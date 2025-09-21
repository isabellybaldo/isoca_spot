import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { SpotifyService } from './spotify.service';
import { SPOTIFY_CLIENT_ID } from './app.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'] // plural so Angular actually loads it
})
export class App {
  protected readonly title = signal('Isoca Spot');

  accessToken: string | null = null;
  topTracks: any[] = [];
  isLoadingTopTracks = false;

  constructor(private spotifyService: SpotifyService) {
    const code = this.getSpotifyCodeFromUrl();
    const storedToken = localStorage.getItem('spotify_access_token');

    if (code) {
      this.spotifyService.callback(code).subscribe({
        next: (response: any) => {
          this.accessToken = response.access_token;
          // coerce null-safe
          localStorage.setItem(
            'spotify_access_token',
            this.accessToken ?? ''
          );
          this.getTopTracks();
          this.clearSpotifyCodeFromUrl();
        },
        error: () => {
          this.accessToken = null;
          localStorage.removeItem('spotify_access_token');
          this.clearSpotifyCodeFromUrl();
        }
      });
    } else if (storedToken) {
      this.accessToken = storedToken;
      this.getTopTracks();
    } else {
      console.log('No Spotify code or token found in URL or localStorage.');
    }

    // keep token in sync across tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'spotify_access_token') {
        this.accessToken = e.newValue;
      }
    });
  }

  private getSpotifyCodeFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('code');
  }

  private clearSpotifyCodeFromUrl() {
    window.history.replaceState({}, document.title, '/');
  }

  getTopTracks() {
    if (!this.accessToken) return;

    this.isLoadingTopTracks = true;
    this.spotifyService
      .getTopTracks(this.accessToken)
      .pipe(finalize(() => (this.isLoadingTopTracks = false)))
      .subscribe({
        next: (res: any) => {
          this.topTracks = Array.isArray(res?.top_tracks) ? res.top_tracks : [];
          console.log('Tracks loaded:', this.topTracks.length);
        },
        error: (err: any) => {
          console.error('getTopTracks failed', err);
          this.topTracks = [];
        }
      });
  }

  startSpotifyAuth() {
    const clientId = SPOTIFY_CLIENT_ID;
    const redirectUri = encodeURIComponent('http://localhost:4200/callback');
    const scopes = encodeURIComponent('user-top-read');
    const authUrl =
      `https://accounts.spotify.com/authorize` +
      `?response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&scope=${scopes}`;
    window.location.href = authUrl;
  }
}
