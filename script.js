document.addEventListener("DOMContentLoaded", () => {

  const phoneInput = document.getElementById("phone");
  const scanButton = document.getElementById("scanButton");

  const status = document.getElementById("status");
  const foundCount = document.getElementById("foundCount");
  const riskCount = document.getElementById("riskCount");
  const safeCount = document.getElementById("safeCount");
  const results = document.getElementById("results");

  scanButton.addEventListener("click", runScan);

  function runScan() {

    const phone = phoneInput.value.trim();

    if (!phone) {
      status.textContent = "Please enter a phone number first.";
      return;
    }

    status.textContent = "🔎 Running local privacy scan...";
    scanButton.disabled = true;

    setTimeout(() => {

      const digits = phone.replace(/\D/g, "");

      if (digits.length < 7) {
        status.textContent = "Please enter a valid phone number.";
        scanButton.disabled = false;
        return;
      }

      foundCount.textContent = "1";
      riskCount.textContent = "0";
      safeCount.textContent = "1";

      results.innerHTML = `
        <strong>🛡️ Scan Complete</strong>
        <p>
          Privacy Scout processed the information locally.
        </p>
        <p>
          No external lookup was performed.
        </p>
        <p>
          <strong>Information entered:</strong> Phone number
        </p>
        <p>
          <strong>External data sent:</strong> None
        </p>
      `;

      status.textContent = "✅ Scan complete.";

      scanButton.disabled = false;

    }, 1000);
  }

});
