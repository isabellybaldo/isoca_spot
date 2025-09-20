# Isoca Spot 🎵

A modern web application for observing and analyzing your music data using Spotify's API. Built with a FastAPI backend and vanilla JavaScript frontend that can be deployed on GitHub Pages.

## Project Structure

```
isoca_spot/
├── backend/          # FastAPI Python backend
│   ├── main.py       # Main FastAPI application
│   ├── requirements.txt
│   └── .env.example  # Environment variables template
├── frontend/         # Vanilla JavaScript frontend
│   ├── index.html    # Main HTML page
│   ├── styles.css    # CSS styling
│   └── script.js     # JavaScript functionality
└── README.md
```

## Features

- 🎵 **Spotify Integration**: Connect to Spotify API to access your music data
- 🚀 **FastAPI Backend**: Modern, fast Python API with automatic documentation
- 🌐 **GitHub Pages Ready**: Frontend can be deployed directly to GitHub Pages
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔄 **Real-time Status**: Live connection status monitoring

## Quick Start

### Easy Setup (Recommended)

Use the provided scripts to quickly start the development environment:

```bash
# Start the backend (in one terminal)
./start-backend.sh

# Start the frontend (in another terminal)
./start-frontend.sh
```

### Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Spotify API credentials
   ```

4. Run the FastAPI server:
   ```bash
   python main.py
   ```

   The API will be available at `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`
   - Health Check: `http://localhost:8000/health`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Open `index.html` in your browser, or serve it with a simple HTTP server:
   ```bash
   # Python 3
   python -m http.server 3000
   
   # Or use any other static file server
   ```

   The frontend will be available at `http://localhost:3000`

## Spotify API Setup

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Copy your Client ID and Client Secret
4. Add `http://localhost:8000/callback` to your app's redirect URIs
5. Update your `backend/.env` file with these credentials

## Deployment

### Frontend (GitHub Pages)

The frontend is designed to be deployable on GitHub Pages:

1. Push your code to a GitHub repository
2. Go to repository Settings → Pages
3. Select source branch (usually `main`)
4. Set folder to `/frontend` or copy frontend files to root
5. Your site will be available at `https://yourusername.github.io/repository-name`

### Backend

The FastAPI backend can be deployed to various platforms:
- Heroku
- Railway
- Vercel
- AWS Lambda
- Google Cloud Run

## Development

### API Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check
- `GET /api/spotify/status` - Spotify connection status

### Extending the Application

The project structure supports easy extension:
- Add new API endpoints in `backend/main.py`
- Create additional frontend pages as needed
- Add new CSS components in `styles.css`
- Extend JavaScript functionality in `script.js`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).