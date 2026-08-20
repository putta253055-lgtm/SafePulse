let latitude = null;
let longitude = null;
let selectedType = "General emergency";


// -------------------------
// EMERGENCY MODE
// -------------------------

function startEmergency() {

    document.getElementById("status").style.display = "block";

    document.getElementById("situation").value =
        "I am experiencing an emergency. Please provide immediate general safety guidance.";

    getLocation();
    updateAlert();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// -------------------------
// EMERGENCY TYPE
// -------------------------

function selectType(type) {

    selectedType = type;

    document.getElementById("situation").value =
        "This is a " + type +
        ". Please provide immediate general safety guidance.";

    getLocation();
    updateAlert();
}


// -------------------------
// LOCATION
// -------------------------

function getLocation() {

    const locationBox =
        document.getElementById("location");

    locationBox.innerHTML =
        "📍 Detecting your location...";

    if (!navigator.geolocation) {

        locationBox.innerHTML =
            "❌ Location services are not supported by this browser.";

        return;
    }

    navigator.geolocation.getCurrentPosition(

        function(position) {

            latitude =
                position.coords.latitude;

            longitude =
                position.coords.longitude;

            locationBox.innerHTML =
                "✅ Location detected<br>" +
                "Latitude: " +
                latitude.toFixed(5) +
                "<br>" +
                "Longitude: " +
                longitude.toFixed(5);

            document.getElementById("mapButton")
                .style.display = "block";

            updateAlert();
        },

        function() {

            locationBox.innerHTML =
                "❌ Unable to access your location.<br>" +
                "Please allow location permission in your browser.";
        }
    );
}


// -------------------------
// OPEN MAP
// -------------------------

function openMap() {

    if (latitude === null || longitude === null) {

        alert("Please detect your location first.");

        return;
    }

    const mapUrl =
        "https://www.google.com/maps?q=" +
        latitude +
        "," +
        longitude;

    window.open(mapUrl, "_blank");
}


// -------------------------
// NEARBY HELP
// -------------------------

function findNearby(service) {

    const status =
        document.getElementById("nearbyStatus");

    if (latitude === null || longitude === null) {

        status.innerHTML =
            "📍 Please detect your location first.";

        getLocation();

        return;
    }

    status.innerHTML =
        "🔎 Finding nearby " +
        service +
        "...";

    const mapUrl =
        "https://www.google.com/maps/search/" +
        encodeURIComponent(service) +
        "/@" +
        latitude +
        "," +
        longitude +
        ",14z";

    status.innerHTML =
        "✅ Opening nearby " +
        service +
        " in Maps...";

    window.open(mapUrl, "_blank");
}


// -------------------------
// TRUSTED CONTACT
// -------------------------

function saveContact() {

    const name =
        document.getElementById("contactName")
            .value.trim();

    const phone =
        document.getElementById("contactPhone")
            .value.trim();

    if (!name || !phone) {

        alert(
            "Please enter both the name and phone number."
        );

        return;
    }

    localStorage.setItem(
        "safePulseContactName",
        name
    );

    localStorage.setItem(
        "safePulseContactPhone",
        phone
    );

    displayContact();
    updateAlert();
}


function displayContact() {

    const name =
        localStorage.getItem(
            "safePulseContactName"
        );

    const phone =
        localStorage.getItem(
            "safePulseContactPhone"
        );

    if (name && phone) {

        document.getElementById("contactName")
            .value = name;

        document.getElementById("contactPhone")
            .value = phone;

        document.getElementById("savedContact")
            .innerText =
            "✅ Trusted contact saved: " +
            name +
            " (" +
            phone +
            ")";
    }
}


// -------------------------
// ALERT MESSAGE
// -------------------------

function updateAlert() {

    const locationText =
        latitude !== null && longitude !== null
            ? "https://www.google.com/maps?q=" +
              latitude +
              "," +
              longitude
            : "Location not detected.";

    const message =
        "🚨 SAFEPULSE EMERGENCY ALERT\n\n" +
        "Emergency type: " +
        selectedType +
        "\n\n" +
        "Location:\n" +
        locationText +
        "\n\n" +
        "Please contact me immediately.\n\n" +
        "Sent using SafePulse.";

    document.getElementById("alertPreview")
        .innerText = message;
}


// -------------------------
// SHARE ALERT
// -------------------------

async function shareAlert() {

    updateAlert();

    const message =
        document.getElementById("alertPreview")
            .innerText;

    if (navigator.share) {

        try {

            await navigator.share({
                title: "SafePulse Emergency Alert",
                text: message
            });

        } catch (error) {

            console.log("Share cancelled.");
        }

    } else {

        try {

            await navigator.clipboard.writeText(message);

            alert(
                "Emergency alert copied to clipboard. " +
                "You can paste it into your messaging app."
            );

        } catch (error) {

            alert(message);
        }
    }
}


// -------------------------
// OLLAMA AI
// -------------------------

async function askAI() {

    const situation =
        document.getElementById("situation")
            .value.trim();

    const responseBox =
        document.getElementById("response");

    if (!situation) {

        alert(
            "Please describe the emergency first."
        );

        return;
    }

    responseBox.style.display = "block";

    responseBox.innerText =
        "🤖 SafePulse AI is thinking...";

    try {

        const response =
            await fetch("/ask-ai", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    situation: situation
                })
            });

        const data =
            await response.json();

        if (data.error) {

            responseBox.innerText =
                "❌ " + data.error;

            return;
        }

        responseBox.innerText =
            "🤖 SafePulse AI\n\n" +
            data.answer;

    } catch (error) {

        responseBox.innerText =
            "❌ Could not connect to SafePulse.";
    }
}


// -------------------------
// LOAD SAVED CONTACT
// -------------------------

displayContact();