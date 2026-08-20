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
// SAFE PULSE EMERGENCY GUIDANCE
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
        "🤖 SafePulse is preparing emergency guidance...";

    await new Promise(resolve =>
        setTimeout(resolve, 500)
    );

    const text =
        situation.toLowerCase();

    let guidance = "";

    if (
        text.includes("medical") ||
        text.includes("injury") ||
        text.includes("bleeding") ||
        text.includes("unconscious") ||
        text.includes("heart")
    ) {

        guidance =
            "MEDICAL EMERGENCY\n\n" +
            "1. Contact your local emergency services immediately.\n" +
            "2. Stay with the affected person if it is safe to do so.\n" +
            "3. If there is severe bleeding, apply firm pressure with clean cloth or gauze.\n" +
            "4. Do not move the person unnecessarily unless there is immediate danger.\n" +
            "5. Follow instructions given by emergency professionals.\n\n" +
            "If the person is unconscious or not breathing normally, seek emergency medical assistance immediately.";

    } else if (
        text.includes("fire") ||
        text.includes("smoke") ||
        text.includes("burn")
    ) {

        guidance =
            "FIRE EMERGENCY\n\n" +
            "1. Move away from the fire and smoke immediately.\n" +
            "2. Alert people nearby and contact the fire service.\n" +
            "3. Use an exit route and avoid elevators.\n" +
            "4. Do not return inside for belongings.\n" +
            "5. If there is smoke, stay as low as possible while leaving.\n\n" +
            "Do not attempt to fight a large or spreading fire yourself.";

    } else if (
        text.includes("accident") ||
        text.includes("crash") ||
        text.includes("car")
    ) {

        guidance =
            "ACCIDENT EMERGENCY\n\n" +
            "1. Move to a safe location if you can do so safely.\n" +
            "2. Contact local emergency services.\n" +
            "3. Check for immediate danger such as traffic, fire or leaking fuel.\n" +
            "4. Do not move an injured person unless there is immediate danger.\n" +
            "5. Provide emergency responders with your location and important details.";

    } else if (
        text.includes("unsafe") ||
        text.includes("danger") ||
        text.includes("threat") ||
        text.includes("attack")
    ) {

        guidance =
            "PERSONAL SAFETY EMERGENCY\n\n" +
            "1. Move toward a safe and populated location if possible.\n" +
            "2. Contact local emergency services if you are in immediate danger.\n" +
            "3. Avoid confronting the person causing the threat.\n" +
            "4. Contact a trusted person and tell them where you are.\n" +
            "5. Keep your phone available for emergency communication.";

    } else {

        guidance =
            "GENERAL EMERGENCY GUIDANCE\n\n" +
            "1. If you are in immediate danger, contact your local emergency services now.\n" +
            "2. Move to a safe location if possible.\n" +
            "3. Tell a trusted person what is happening.\n" +
            "4. Share your location with emergency responders when appropriate.\n" +
            "5. Follow instructions from trained emergency professionals.\n\n" +
            "Describe the situation clearly to emergency responders so they can provide appropriate assistance.";
    }

    responseBox.innerText =
        "🤖 SafePulse Emergency Guidance\n\n" +
        guidance;
}


// -------------------------
// LOAD SAVED CONTACT
// -------------------------

displayContact();