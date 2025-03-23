const clientId = "3e96f6baa32b4a98b1a3cb8d235d3d55";  // Vervang door jouw Spotify Client ID
const redirectUri = "https://chantyk.github.io/HitScan/callback.html";  // Redirect URI van Spotify Developer Console
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
    const token = localStorage.getItem("access_token"); // Verkrijg token uit localStorage
    console.log("Access token:", token);
    return token;
}

// Haal de apparaten op die beschikbaar zijn voor het afspelen van muziek
async function getDevices(token) {
    const response = await fetch("https://api.spotify.com/v1/me/player/devices", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    const devices = await response.json();
    return devices.devices;
}

// Start het specifieke nummer op 30 sec
async function playTrack() {
    const token = getAccessToken();
    if (!token) {
        login();
        return;
    }

    const trackId = getTrackIdFromUrl();
    if (!trackId) {
        console.error("Geen track-ID gevonden in de URL.");
        return;
    }

    // Verkrijg apparaten
    const devices = await getDevices(token);
    if (devices.length === 0) {
        console.error("Geen actieve apparaten gevonden.");
        return;
    }

    const deviceId = devices[0].id;  // Kies het eerste beschikbare apparaat

    try {
        // Start de track op het gekozen apparaat
        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ "uris": [`spotify:track:${trackId}`] })
        });

        // Seek naar 30 seconden
        setTimeout(async () => {
            await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${seekTime}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
        }, 1000);  // Wacht 1 seconde voordat je naar de 30 seconden gaat

        console.log("Track gestart!");
    } catch (error) {
        console.error("Fout bij afspelen:", error);
    }
}

// Voeg event listener toe aan de knop
document.getElementById("playButton").addEventListener("click", async () => {
    await playTrack();
});
