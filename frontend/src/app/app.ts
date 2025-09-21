import { Component, signal, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { SpotifyService, SpotifyCallbackResponse, TopTracksResponse } from './spotify.service';
import { SPOTIFY_CLIENT_ID } from './app.config';

// Define Track interface before the component decorator so decorator applies to class properly
export interface Track {
  name: string;
  artists: string[];
  popularity: number;
  genres: string[];
  spotify_link: string;
  image_url: string | null;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'] // plural so Angular actually loads it
})
export class App {
  protected readonly title = signal('Isoca Spot');

  // Reactive state as signals (zoneless friendly)
  accessToken = signal<string | null>(null);
  topTracks = signal<Track[]>([]);
  isLoadingTopTracks = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(private spotifyService: SpotifyService) {
    const code = this.getSpotifyCodeFromUrl();
    const storedToken = localStorage.getItem('spotify_access_token');

    if (code) {
      this.spotifyService.callback(code).subscribe({
        next: (response: SpotifyCallbackResponse) => {
          this.accessToken.set(response.access_token || null);
          localStorage.setItem('spotify_access_token', this.accessToken() ?? '');
          this.clearSpotifyCodeFromUrl();
        },
        error: () => {
          this.accessToken.set(null);
          localStorage.removeItem('spotify_access_token');
          this.clearSpotifyCodeFromUrl();
        }
      });
    } else if (storedToken) {
      this.accessToken.set(storedToken);
    } else {
      console.log('No Spotify code or token found in URL or localStorage.');
    }

    // Keep token in sync across tabs
    window.addEventListener('storage', (e: StorageEvent) => {
      if (e.key === 'spotify_access_token') {
        this.accessToken.set(e.newValue);
      }
    });

    // Reactively load tracks when token becomes available
    effect(() => {
      const token = this.accessToken();
      if (token) {
        this.loadTopTracks();
      } else {
        this.topTracks.set([]);
      }
    });
  }

  private getSpotifyCodeFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('code');
  }

  private clearSpotifyCodeFromUrl(): void {
    // Preserve current pathname instead of forcing root
    const basePath = window.location.pathname.split('?')[0];
    window.history.replaceState({}, document.title, basePath || '/');
  }

  private loadTopTracks(): void {
    const token = this.accessToken();
    if (!token) return;

    this.isLoadingTopTracks.set(true);
    this.errorMessage.set(null);
    this.spotifyService
      .getTopTracks(token)
      .pipe(finalize(() => this.isLoadingTopTracks.set(false)))
      .subscribe({
        next: (res: TopTracksResponse) => {
          const list = Array.isArray(res?.top_tracks) ? (res.top_tracks as Track[]) : [];
          this.topTracks.set(list);
          console.log('Tracks loaded:', list.length);
        },
        error: (err: any) => {
          console.error('getTopTracks failed', err);
          if (err?.status === 401) {
            // Token likely expired; clear and prompt re-auth.
            localStorage.removeItem('spotify_access_token');
            this.accessToken.set(null);
          }
          this.topTracks.set([]);
          this.errorMessage.set('Failed to load top tracks. Please try again.');
        }
      });
  }

  startSpotifyAuth(): void {
    const clientId = SPOTIFY_CLIENT_ID;
    // Use the /callback path so Spotify redirects back to the frontend callback handler
    const redirectUri = encodeURIComponent(window.location.origin + '/callback');
    const scopes = encodeURIComponent('user-top-read');
    // NOTE: For production add state & PKCE. Omitted here for brevity.
    const authUrl =
      `https://accounts.spotify.com/authorize` +
      `?response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&scope=${scopes}`;
    window.location.href = authUrl;
  }
}
