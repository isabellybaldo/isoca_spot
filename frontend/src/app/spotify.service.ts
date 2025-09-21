import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SpotifyStatusResponse {
  spotify_connected: boolean;
  message: string;
  next_steps: string;
}

export interface SpotifyCallbackResponse {
  access_token: string;
  message: string;
}

export interface TopTracksResponse {
  top_tracks: any[];
}

@Injectable({ providedIn: 'root' })
export class SpotifyService {
  private apiUrl = 'http://localhost:8000/api/spotify';

  constructor(private http: HttpClient) {}

  callback(code: string): Observable<SpotifyCallbackResponse> {
    const params = new HttpParams().set('code', code);
    return this.http.get<SpotifyCallbackResponse>(`${this.apiUrl}/callback`, { params });
  }

  getTopTracks(accessToken: string): Observable<TopTracksResponse> {
    const params = new HttpParams().set('access_token', accessToken);
    return this.http.get<TopTracksResponse>(`${this.apiUrl}/top-tracks`, { params });
  }
}

