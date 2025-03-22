const clientId = "3e96f6baa32b4a98b1a3cb8d235d3d55";  // Vervang door jouw Spotify Client ID
const redirectUri = "https://chantyk.github.io/HitScan/callback";  // Zorg dat dit hetzelfde is als in je Spotify Developer Console
const seekTime = 30000;  // 30 seconden in milliseconden

// Haal track-ID op uit de URL
function getTrackIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("track");
}

// Spotify login functie
function login() {
    const scopes = "user-modify-playback-state user-read-playback-state";
    window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
}

// Haal het token op uit localStorage of de URL
function getAccessToken() {
    let token = localStorage.getItem("spotify_access_token");  // Haal token uit localStorage
    console.log("Haal token op:", token);  // Log het token naar de console
    if (!token) {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const tokenFromUrl = params.get("access_token");
        
        if (tokenFromUrl) {
            localStorage.setItem("spotify_access_token", tokenFromUrl);  // Bewaar token in localStorage
            window.location.hash = '';  // Verwijder de token uit de URL
            token = tokenFromUrl;  // Zet token om van de URL
            console.log("Token uit URL opgeslagen:", token);  // Log de token die uit de URL is gehaald
        }
    }
    return token;
}

// Start het specifieke nummer op 30 sec
async function playTrack() {
    const token = getAccessToken();
    if (!token) {
        console.log("Geen toegangstoken gevonden. Gebruiker wordt doorgestuurd naar inlogpagina.");
        login();  // Als er geen token is, stuur de gebruiker naar de login pagina
        return;
    }

    const trackId = getTrackIdFromUrl();  // Haal track-ID op uit de URL
    if (!trackId) {
        console.error("Geen track-ID gevonden in de URL.");
        return;
    }

    try {
        console.log("Start track met ID:", trackId);

        // Start de track
        const response = await fetch("https://api.spotify.com/v1/me/player/play", {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ "uris": ["spotify:track:" + trackId] })
        });

        // Controleer of de API-aanroep succesvol was
        if (response.ok) {
            console.log("Track gestart!");
            // Seek naar 30 seconden
            setTimeout(async () => {
                const seekResponse = await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${seekTime}`, {
                    method: "PUT",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                
                if (seekResponse.ok) {
                    console.log("Track staat op 30 seconden.");
                } else {
                    console.error("Fout bij seeken:", seekResponse.status);
                }
            }, 1000);  // Wacht 1 seconde voordat je naar de 30 seconden gaat
        } else {
            console.error("Fout bij het starten van de track:", response.status);
        }
    } catch (error) {
        console.error("Fout bij afspelen:", error);
    }
}

// Voeg event listener toe aan de knop
document.getElementById("playButton").addEventListener("click", async () => {
    await playTrack();
});
