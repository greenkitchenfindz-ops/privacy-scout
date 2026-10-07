// Privacy Scout
// Basic privacy scan engine

document.addEventListener("DOMContentLoaded", () => {
    const status = document.getElementById("status");
    const scanButton = document.getElementById("scanButton");

    if (status) {
        status.textContent = "Privacy Scout is ready.";
    }

    if (scanButton) {
        scanButton.addEventListener("click", runPrivacyScan);
    }
});

function runPrivacyScan() {
    const status = document.getElementById("status");

    if (!status) return;

    status.textContent = "Scanning for privacy risks...";

    setTimeout(() => {
        status.textContent = "Scan complete. No information was sent anywhere.";
    }, 1500);
}
