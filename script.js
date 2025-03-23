// Haal het access token uit localStorage
const accessToken = localStorage.getItem("spotify_access_token");
if (!accessToken) {
    console.error("Geen geldig Spotify token. Gebruiker moet inloggen.");
    window.location.href = "index.html"; // Redirect naar loginpagina als geen token
}

// Functie om apparaten van de gebruiker op te halen
function getSpotifyDevices() {
    fetch("https://api.spotify.com/v1/me/player/devices", {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log(data); // Bekijk de apparaten in de console
        if (data.devices.length > 0) {
            playSong(data.devices[0].id); // Kies het eerste apparaat en speel de muziek af
        } else {
            console.error("Geen apparaten gevonden.");
        }
    })
    .catch(error => console.error('Error bij ophalen apparaten:', error));
}

// Functie om muziek af te spelen
function playSong(deviceId) {
    const trackUri = "spotify:track:3n3Ppam7vgaVa1iaRUc9Lp"; // Vervang door jouw track URI
    const position_ms = 30000; // Start de muziek vanaf 30 seconden

    fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            device_ids: [deviceId], // Gebruik het geselecteerde apparaat
            uris: [trackUri], // Specificeer de track URI
            position_ms: position_ms // Start vanaf 30 seconden
        })
    })
    .then(res => res.json())
    .then(data => console.log("Muziek speelt vanaf 30 sec"))
    .catch(error => console.error('Error bij afspelen:', error));
}

// Zorg ervoor dat we de apparaten ophalen zodra de pagina is geladen
window.onload = function() {
    getSpotifyDevices();
};
