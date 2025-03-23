const clientId = "3e96f6baa32b4a98b1a3cb8d235d3d55";  // Vervang door jouw Spotify Client ID
const redirectUri = "https://chantyk.github.io/HitScan/callback";  // Vervang door jouw redirect URI
const seekTime = 30000;  // 30 seconden in milliseconden

// Haal het access token uit de local storage (dat is waar het wordt opgeslagen na inloggen)
function getAccessToken() {
    const token = localStorage.getItem("access_token");
    console.log("Access token:", token);  // Log het token naar de console
    return token;
}

// Haal track-ID op uit de URL
function getTrackIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("track");
}

// Haal de apparaten op die beschikbaar zijn voor afspelen
async function getDevices(token) {
    const response = await fetch("https://api.spotify.com/v1/me/player/devices", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    const devices = await response.json();
    console.log("Beschikbare apparaten:", devices);  // Log de apparaten
    return devices.devices;
}

// Start het specifieke nummer op 30 sec
async function playTrack() {
    const token = getAccessToken();
    if (!token) {
        console.log("Geen token gevonden. Gebruiker moet opnieuw inloggen.");
        login();
        return;
    }

    const trackId = getTrackIdFromUrl();
    if (!trackId) {
        console.error("Geen track-ID gevonden in de URL.");
        return;
    }

    try {
        // Haal beschikbare apparaten op
        const devices = await getDevices(token);

        if (devices.length === 0) {
            console.error("Geen apparaten gevonden om af te spelen.");
            return;
        }

        // Start de track op een beschikbaar apparaat (gebruik het eerste apparaat in de lijst)
        const deviceId = devices[0].id;
        await fetch("https://api.spotify.com/v1/me/player/play", {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "uris": [`spotify:track:${trackId}`], "device_id": deviceId })
        });

        console.log("Track gestart!");

        // Seek naar 30 seconden
        setTimeout(async () => {
            await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${seekTime}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log("Naar 30 seconden gesprongen!");
        }, 1000);  // Wacht 1 seconde voordat je naar de 30 seconden gaat

    } catch (error) {
        console.error("Fout bij afspelen:", error);
    }
}

// Spotify login
function login() {
    const scopes = "user-modify-playback-state user-read-playback-state";
    window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
}

// Voeg event listener toe aan de knop
document.getElementById("playButton").addEventListener("click", async () => {
    await playTrack();
});
