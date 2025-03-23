const clientId = "3e96f6baa32b4a98b1a3cb8d235d3d55"; // Spotify client ID
const redirectUri = "https://chantyk.github.io/HitScan/callback.html"; // Redirect URL
const scope = "user-read-playback-state user-modify-playback-state streaming"; // Gewenste scope

// Maak de login URL aan voor Implicit Grant Flow
const loginUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&show_dialog=true`;

// Als de gebruiker op de login knop klikt, wordt deze doorgestuurd naar Spotify
document.getElementById("login-btn").addEventListener("click", function() {
    window.location.href = loginUrl;
});

// Controleer of de access token al in localStorage staat, indien ja, gebruik deze om af te spelen
window.onload = function() {
    const accessToken = localStorage.getItem("spotifyAccessToken");

    if (accessToken) {
        console.log("Token gevonden in localStorage: ", accessToken);
        // Je kunt hier de logica toevoegen voor het afspelen van muziek, bijv. playSong(accessToken);
    }
};

// Functie om muziek af te spelen
function playSong(accessToken, trackId) {
    const songData = {
        uris: [`spotify:track:${trackId}`]  // Vervang dit door de track die je wilt afspelen
    };

    const playSongUrl = "https://api.spotify.com/v1/me/player/play";

    fetch(playSongUrl, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(songData)
    })
    .then(response => {
        if (response.status === 401) {
            // Als de token is verlopen, geef een melding
            alert("Je sessie is verlopen. Log opnieuw in.");
            window.location.href = "https://chantyk.github.io/HitScan/callback.html"; // Of naar login-pagina
        } else {
            return response.json();
        }
    })
    .then(data => {
        console.log("Nummer wordt afgespeeld:", data);
    })
    .catch(error => {
        console.error("Fout bij afspelen nummer:", error);
    });
}
