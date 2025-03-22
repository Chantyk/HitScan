const clientId = "JOUW_SPOTIFY_CLIENT_ID";  // Vervang door jouw Spotify Client ID
const redirectUri = "JOUW_REDIRECT_URI";  // Vervang door jouw redirect URI (bijvoorbeeld: https://chantyk.github.io/HitScan/)
const seekTime = 30000;  // 30 seconden in milliseconden

// Haal track-ID op uit de URL
function getTrackIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("track");
}

// Spotify login
function login() {
    const scopes = "user-modify-playback-state user-read-playback-state";
    window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
}

// Haal het token op
function getAccessToken() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get("access_token");
}

// Start het specifieke nummer op 30 sec
async function playTrack() {
    const token = getAccessToken();
    if (!token) {
        login();
        return;
    }

    const trackId = getTrackIdFromUrl();  // Haal track-ID op uit de URL
    if (!trackId) {
        console.error("Geen track-ID gevonden in de URL.");
        return;
    }

    try {
        // Start de track
        await fetch("https://api.spotify.com/v1/me/player/play", {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ "uris": ["spotify:track:" + trackId] })
        });

        // Seek naar 30 seconden
        setTimeout(async () => {
            await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${seekTime}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
        }, 1000);  // Wacht 1 seconde voordat je naar de 30 seconden gaat
    } catch (error) {
        console.error("Fout bij afspelen:", error);
    }
}

// Voeg event listener toe aan de knop
document.getElementById("playButton").addEventListener("click", async () => {
    await playTrack();
});
