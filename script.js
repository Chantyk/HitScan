// Verkrijg de toegangstoken (dit zou al in je code moeten zitten)
function getAccessToken() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('access_token');
}

// Verkrijg de track-id uit de URL
function getTrackIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('track');
}

// Functie om apparaten op te halen
async function getDevices(token) {
    const response = await fetch("https://api.spotify.com/v1/me/player/devices", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    const devices = await response.json();
    if (devices.devices.length === 0) {
        console.log("Geen actieve apparaten gevonden.");
        return null;
    }
    return devices.devices;
}

// Functie om de track af te spelen op een geselecteerd apparaat
async function playTrack() {
    const token = getAccessToken();
    if (!token) {
        console.log("Geen token gevonden. Gebruiker moet opnieuw inloggen.");
        return;
    }

    const trackId = getTrackIdFromUrl();
    if (!trackId) {
        console.error("Geen track-ID gevonden in de URL.");
        return;
    }

    try {
        // Verkrijg actieve apparaten
        const devices = await getDevices(token);
        if (!devices) {
            console.error("Er zijn geen apparaten beschikbaar om af te spelen.");
            return;
        }

        // Kies het eerste beschikbare apparaat
        const deviceId = devices[0].id;

        // Start de track op het geselecteerde apparaat
        const playResponse = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "uris": [`spotify:track:${trackId}`] })
        });

        if (playResponse.ok) {
            console.log("Track gestart!");
        } else {
            const errorDetails = await playResponse.json();
            console.error("Fout bij starten van track:", errorDetails);
        }

    } catch (error) {
        console.error("Fout bij afspelen:", error);
    }
}

// Functie om de pagina in te stellen wanneer deze wordt geladen
window.onload = function() {
    const token = getAccessToken();
    if (!token) {
        console.log("Token ontbreekt. Inloggen is vereist.");
        return;
    }

    // Begin afspelen van de track zodra de pagina geladen is
    playTrack();
};
