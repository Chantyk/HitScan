const client_id = "3e96f6baa32b4a98b1a3cb8d235d3d55";
const redirect_uri = "https://chantyk.github.io/HitScan/callback.html";
const scopes = "user-read-playback-state user-modify-playback-state streaming";

// Functie om de gebruiker naar Spotify in te laten loggen
function login() {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${encodeURIComponent(scopes)}`;
    window.location.href = authUrl;
}

// Functie om een nummer af te spelen vanaf 30 sec
async function playTrack(trackUri) {
    const accessToken = localStorage.getItem("spotify_access_token");
    if (!accessToken) {
        console.error("Geen toegangstoken gevonden! Log eerst in.");
        login();
        return;
    }

    try {
        // Actieve Spotify-apparaten ophalen
        let response = await fetch("https://api.spotify.com/v1/me/player/devices", {
            headers: { "Authorization": `Bearer ${accessToken}` }
        });
        let data = await response.json();

        if (!data.devices || data.devices.length === 0) {
            console.error("Geen actieve Spotify-apparaten gevonden. Open Spotify op een apparaat!");
            return;
        }

        let deviceId = data.devices[0].id; // Kies het eerste beschikbare apparaat

        // Track afspelen vanaf 30 sec
        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uris: [trackUri],
                position_ms: 30000 // Start op 30 sec
            })
        });

        console.log("Track speelt af vanaf 30 seconden!");
    } catch (error) {
        console.error("Fout bij afspelen:", error);
    }
}

// Check bij laden of er een token is
window.onload = function () {
    const token = localStorage.getItem("spotify_access_token");
    if (!token) {
        console.log("Geen token gevonden. Gebruiker moet inloggen.");
    }
};
