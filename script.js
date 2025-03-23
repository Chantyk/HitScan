function loginWithSpotify() {
    const clientId = "3e96f6baa32b4a98b1a3cb8d235d3d55";
    const redirectUri = "https://chantyk.github.io/HitScan/callback.html";
    const scopes = "user-read-playback-state user-modify-playback-state streaming";

    const authUrl = `https://accounts.spotify.com/authorize?` +
        `client_id=${clientId}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${encodeURIComponent(scopes)}` +
        `&show_dialog=true`;

    window.location.href = authUrl;
}

async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("spotifyRefreshToken");
    if (!refreshToken) {
        console.error("Geen refresh token beschikbaar");
        return;
    }

    const clientId = "3e96f6baa32b4a98b1a3cb8d235d3d55";
    const clientSecret = "JOUW_CLIENT_SECRET"; 

    const body = new URLSearchParams();
    body.append("grant_type", "refresh_token");
    body.append("refresh_token", refreshToken);
    body.append("client_id", clientId);
    body.append("client_secret", clientSecret);

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body
    });

    const data = await response.json();

    if (data.access_token) {
        localStorage.setItem("spotifyAccessToken", data.access_token);
        localStorage.setItem("spotifyTokenExpiration", Date.now() + data.expires_in * 1000);
    } else {
        console.error("Kon geen nieuw token verkrijgen:", data);
    }
}

function checkToken() {
    const expiration = localStorage.getItem("spotifyTokenExpiration");
    if (expiration && Date.now() > expiration) {
        refreshAccessToken();
    }
}
checkToken();
