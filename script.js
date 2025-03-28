// Callbackfunctie voor succesvolle QR-code scan
function onScanSuccess(decodedText, decodedResult) {
    console.log(`QR code gescand: ${decodedText}`, decodedResult);
    document.getElementById('status').innerText = `QR Code gescand: ${decodedText}`;
    
    // Functie om het nummer af te spelen in Spotify vanaf een specifieke tijd
    playSpotifyTrack(decodedText);
}

// Callbackfunctie voor fouten bij het scannen
function onScanFailure(error) {
    console.warn(`QR scan error: ${error}`);
    document.getElementById('status').innerText = "QR-code kon niet worden gescand.";
}

// Functie om Spotify-track af te spelen vanaf een specifieke tijd
function playSpotifyTrack(trackId) {
    const token = '3e96f6baa32b4a98b1a3cb8d235d3d55';  // Spotify access token
    const trackUrl = `https://api.spotify.com/v1/tracks/${trackId}`;
    
    fetch(trackUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const trackUri = data.uri;
        const audio = new Audio(`https://open.spotify.com/embed/track/${trackId}?autoplay=true&start=30`);
        audio.play();
        console.log('Track wordt afgespeeld vanaf 30 seconden');
    })
    .catch(error => {
        console.error('Fout bij het afspelen van de track:', error);
    });
}

// Functie om de QR-code scanner te starten
function startQRCodeScanner() {
    if (typeof Html5Qrcode === "undefined") {
        console.error("Html5Qrcode bibliotheek is niet geladen.");
        document.getElementById('status').innerText = "Er is een fout opgetreden bij het laden van de scanner bibliotheek.";
        return;
    }

    const html5QrCode = new Html5Qrcode("qr-reader");

    // Start de QR-code scanner
    html5QrCode.start(
        { facingMode: "environment" },  // Gebruik de achtercamera
        {
            fps: 10, // Frames per second
            qrbox: 250, // Grootte van de QR-code scanbox
            rememberLastUsedCamera: true,  // Bewaar de laatste camera-instelling
            formatsToSupport: ["QR_CODE"], // Specifieer welk type code je wilt scannen
        },
        onScanSuccess,  // Callback voor succesvolle scan
        onScanFailure   // Callback voor fouten
    ).catch(err => {
        console.error("Fout bij het starten van de QR-code scanner:", err);
        document.getElementById('status').innerText = "Er is een fout opgetreden bij het starten van de scanner.";
    });
}

// Start de scanner wanneer de pagina is geladen
window.onload = function() {
    startQRCodeScanner();
};
