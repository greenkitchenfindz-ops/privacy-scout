// Privacy Scout
// Main JavaScript

document.addEventListener("DOMContentLoaded", () => {
    console.log("Privacy Scout loaded.");

    const status = document.getElementById("status");

    if (status) {
        status.textContent = "Privacy Scout is ready.";
    }
});
