const clientId = "3e96f6baa32b4a98b1a3cb8d235d3d55";  // Vervang door jouw Spotify Client ID
const redirectUri = "https://chantyk.github.io/HitScan/callback";  // Vervang door jouw redirect URI (bijvoorbeeld: https://chantyk.github.io/HitScan/)
const seekTime = 30000;  // 30 seconden in milliseconden

// Haal track-ID op uit de URL
function getTrackIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("track");
}

// Haal het access token op uit de URL na inloggen
function getAccessToken() {
    const hash = window.location.hash.substring(1);  // Haal alles na '#' op
    const params = new URLSearchParams(hash);  // Zet om in een makkelijk te lezen format
    const token = params.get("access_token");  // Haal de access_token uit de URL
    console.log("Access token:", token);  // Log het token naar de console
    return token;
}

// Spotify login
function login() {
    const scopes = "user-modify-playback-state user-read-playback-state";
    window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
}

// Start het specifieke nummer op 30 sec
async function playTrack() {
    const token = getAccessToken();
    if (!token) {
        login();  // Als er geen token is, wordt de gebruiker ingelogd
        return;
    }

    const trackId = getTrackIdFromUrl();  // Haal track-ID op uit de URL
    if (!trackId) {
        console.error("Geen track-ID gevonden in de URL.");
        return;
    }

    try {
        console.log("Token voor afspelen:", token);  // Log de token voor debugging
        const response = await fetch("https://api.spotify.com/v1/me/player/play", {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ "uris": ["spotify:track:" + trackId] })
        });

        console.log("API response:", response);  // Log de response van de API
        if (response.ok) {
            console.log("Track is gestart.");
        } else {
            console.error("Fout bij afspelen:", await response.json());
        }

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
