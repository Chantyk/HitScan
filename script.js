// Functie om het nummer af te spelen vanaf 30 seconden
function playSongFrom30Seconds(accessToken, trackId) {
  const endpoint = `https://api.spotify.com/v1/me/player/play`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
  
  const body = JSON.stringify({
    uris: [`spotify:track:${trackId}`], // Spotify Track URI
    position_ms: 30000, // Start vanaf 30 seconden (30.000 ms)
  });

  fetch(endpoint, {
    method: 'PUT',
    headers: headers,
    body: body,
  })
  .then(response => response.json())
  .then(data => {
    console.log("Nummer wordt afgespeeld vanaf 30 seconden.");
    
    // Stop het nummer na 20 seconden (20.000 ms)
    setTimeout(() => {
      stopSong(accessToken);
    }, 20000); // Stop het na 20 seconden
  })
  .catch(error => console.error("Fout bij afspelen nummer:", error));
}

// Functie om het nummer te stoppen
function stopSong(accessToken) {
  const endpoint = `https://api.spotify.com/v1/me/player/pause`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  fetch(endpoint, {
    method: 'PUT',
    headers: headers,
  })
  .then(response => response.json())
  .then(data => console.log("Nummer is gestopt."))
  .catch(error => console.error("Fout bij stoppen nummer:", error));
}

// Functie voor wanneer een QR-code wordt gescand
function onScanSuccess(decodedText) {
  console.log("Scanned: " + decodedText);
  
  // Als het een Spotify-link is
  if (decodedText.includes("spotify.com/track/")) {
    const trackId = decodedText.split("/").pop();  // Haal de track ID uit de URL
    const accessToken = localStorage.getItem('access_token'); // Haal het token op uit localStorage
    
    if (accessToken) {
      playSongFrom30Seconds(accessToken, trackId);  // Speel het nummer vanaf 30 seconden af
    } else {
      alert("Je moet eerst inloggen.");
    }
  } else {
    alert("Geen geldige Spotify-link!");
  }
}

// QR-code scanner initialisatie
function startQRCodeScanner() {
  const html5QrCode = new Html5Qrcode("qr-reader");

  html5QrCode.start(
    { facingMode: "environment" },
    {
      fps: 10, // Frames per second
      qrbox: 250, // Grootte van de QR-code scanbox
    },
    onScanSuccess
  ).catch(err => {
    console.error("QR-code scanner error:", err);
  });
}

window.onload = function() {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    startQRCodeScanner();
  } else {
    window.location.href = 'https://chantyk.github.io/HitScan/callback.html';
  }
};
