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
        
        // Zorg ervoor dat het apparaat beschikbaar is om muziek af te spelen
        const deviceResponse = await fetch("https://api.spotify.com/v1/me/player/devices", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const devices = await deviceResponse.json();
        if (devices && devices.devices && devices.devices.length > 0) {
            const deviceId = devices.devices[0].id;  // Kies het eerste apparaat
            console.log("Speel track af op apparaat:", deviceId);

            // Start de track op het gekozen apparaat
            const playResponse = await fetch("https://api.spotify.com/v1/me/player/play?device_id=" + deviceId, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ "uris": ["spotify:track:" + trackId] })
            });

            if (playResponse.ok) {
                console.log("Track gestart op apparaat:", deviceId);
                setTimeout(async () => {
                    // Seek naar 30 seconden
                    await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${seekTime}`, {
                        method: "PUT",
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                }, 1000);  // Wacht 1 seconde voordat je naar de 30 seconden gaat
            } else {
                console.error("Fout bij starten van de track op apparaat:", playResponse.status);
            }
        } else {
            console.error("Geen apparaten gevonden.");
        }
    } catch (error) {
        console.error("Fout bij afspelen:", error);
    }
}
