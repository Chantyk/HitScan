const clientId = "3e96f6baa32b4a98b1a3cb8d235d3d55";  // Vervang door jouw Spotify Client ID
const redirectUri = "https://chantyk.github.io/HitScan/callback";  // Vervang door jouw redirect URI
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
    const token = localStorage.getItem("access_token");
    console.log("Access token vanuit localStorage:", token); // Dit moet het token loggen naar de console
    if (!token) {
        login(); // Als er geen token is, vraag om inloggen
        return;
    }
    return token;
}

// Start het specifieke nummer op 30 sec
async function playTrack() {
    const token = getAccessToken();
    if (!token) {
        login();
        return;
    }

    const trackId = getTrackIdFromUrl();  // Haal track-ID op uit de URL
    console.log("Track-ID:", trackId); // Log de track-ID naar de console
    if (!trackId) {
        console.error("Geen track-ID gevonden in de URL.");
        return;
    }

    try {
        console.log("Spotify API aanroepen met token:", token);
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
