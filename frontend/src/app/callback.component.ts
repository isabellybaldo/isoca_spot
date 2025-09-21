import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-callback',
  standalone: true,
  template: `
    <div style="display:flex;align-items:center;justify-content:center;height:100%;padding:2rem;">
      <div>
        <h2 style="margin:0 0 0.5rem 0;">Processing Spotify sign-in…</h2>
        <p style="margin:0;color:var(--gray-700);">You will be redirected shortly.</p>
        @if (error) {
          <p style="color:#d22;margin-top:0.5rem">{{ error }}</p>
        }
      </div>
    </div>
  `
})
export class CallbackComponent implements OnInit {
  error: string | null = null;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    // Read code from query param and exchange it via backend
    this.route.queryParamMap.subscribe((params) => {
      const code = params.get('code');
      if (!code) {
        this.error = 'Missing authorization code.';
        setTimeout(() => this.router.navigate(['/']), 1000);
        return;
      }

      const backend = 'http://localhost:8000/api/spotify/callback';
      this.http.get<{ access_token: string; message?: string }>(backend, { params: { code } }).subscribe({
        next: (res) => {
          if (res?.access_token) {
            localStorage.setItem('spotify_access_token', res.access_token);
          }
          // Navigate home without query params
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Callback exchange failed', err);
          this.error = 'Failed to complete Spotify sign-in. See console for details.';
          setTimeout(() => this.router.navigate(['/']), 1500);
        }
      });
    });
  }
}
