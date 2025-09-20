// Isoca Spot Frontend JavaScript

// Configuration
const API_BASE_URL = 'http://localhost:8000';

// DOM Elements
const apiStatusElement = document.getElementById('api-status');
const spotifyStatusElement = document.getElementById('spotify-status');
const connectSpotifyButton = document.getElementById('connect-spotify');
const musicDataElement = document.getElementById('music-data');

// State
let apiConnected = false;
let spotifyConnected = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Isoca Spot frontend loaded');
    checkApiStatus();
    checkSpotifyStatus();
    
    // Set up event listeners
    connectSpotifyButton.addEventListener('click', connectToSpotify);
});

// Check API connection status
async function checkApiStatus() {
    try {
        showLoading(apiStatusElement, 'Checking API connection...');
        
        const response = await fetch(`${API_BASE_URL}/health`);
        
        if (response.ok) {
            const data = await response.json();
            apiConnected = true;
            showSuccess(apiStatusElement, `✅ API Connected - ${data.status}`);
        } else {
            throw new Error(`API responded with status: ${response.status}`);
        }
    } catch (error) {
        console.error('API connection failed:', error);
        apiConnected = false;
        showError(apiStatusElement, '❌ API Connection Failed - Make sure the backend is running on localhost:8000');
    }
}

// Check Spotify integration status
async function checkSpotifyStatus() {
    try {
        showLoading(spotifyStatusElement, 'Checking Spotify integration...');
        
        const response = await fetch(`${API_BASE_URL}/api/spotify/status`);
        
        if (response.ok) {
            const data = await response.json();
            spotifyConnected = data.spotify_connected;
            
            if (spotifyConnected) {
                showSuccess(spotifyStatusElement, '✅ Spotify Connected');
                connectSpotifyButton.textContent = 'Refresh Data';
                connectSpotifyButton.disabled = false;
            } else {
                showWarning(spotifyStatusElement, `⚠️ ${data.message}`);
                connectSpotifyButton.textContent = 'Connect to Spotify';
                connectSpotifyButton.disabled = !apiConnected;
            }
        } else {
            throw new Error(`Spotify API check failed: ${response.status}`);
        }
    } catch (error) {
        console.error('Spotify status check failed:', error);
        showError(spotifyStatusElement, '❌ Could not check Spotify status');
        connectSpotifyButton.disabled = true;
    }
}

// Connect to Spotify (placeholder for now)
function connectToSpotify() {
    showLoading(musicDataElement, 'Connecting to Spotify...');
    
    // TODO: Implement actual Spotify OAuth flow
    setTimeout(() => {
        showWarning(musicDataElement, '🚧 Spotify integration coming soon! Configure your Spotify API credentials in the backend first.');
    }, 1500);
}

// Utility functions for displaying status
function showLoading(element, message) {
    element.innerHTML = `<div class="loading"></div>${message}`;
    element.className = 'status-card';
}

function showSuccess(element, message) {
    element.innerHTML = message;
    element.className = 'status-card connected';
}

function showError(element, message) {
    element.innerHTML = message;
    element.className = 'status-card error';
}

function showWarning(element, message) {
    element.innerHTML = message;
    element.className = 'status-card';
}

// Error handling for fetch requests
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});

// Export functions for potential testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkApiStatus,
        checkSpotifyStatus,
        connectToSpotify
    };
}