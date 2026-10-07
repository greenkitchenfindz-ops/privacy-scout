document.addEventListener("DOMContentLoaded", () => {

  const phoneInput = document.getElementById("phone");
  const scanButton = document.getElementById("scanButton");
  const cleanupButton = document.getElementById("cleanupButton");

  const status = document.getElementById("status");
  const foundCount = document.getElementById("foundCount");
  const riskCount = document.getElementById("riskCount");
  const safeCount = document.getElementById("safeCount");
  const results = document.getElementById("results");
  const cleanupResults = document.getElementById("cleanupResults");

  let lastScannedPhone = "";

  scanButton.addEventListener("click", runScan);
  cleanupButton.addEventListener("click", createCleanupPlan);

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

      lastScannedPhone = phone;

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
          <strong>Information entered:</strong>
          Phone number
        </p>

        <p>
          <strong>External data sent:</strong>
          None
        </p>

        <p>
          <strong>Next step:</strong>
          You can create a local Privacy Cleanup plan below.
        </p>
      `;

      status.textContent = "✅ Scan complete.";

      scanButton.disabled = false;

    }, 1000);
  }

  function createCleanupPlan() {

    if (!lastScannedPhone) {
      cleanupResults.innerHTML = `
        <div class="cleanup-item">
          <h3>📱 Scan Required</h3>
          <p>
            Enter a phone number and run the Privacy Scout scan first.
          </p>
        </div>
      `;

      return;
    }

    cleanupButton.disabled = true;
    cleanupButton.textContent = "🧹 Building Cleanup Plan...";

    setTimeout(() => {

      cleanupResults.innerHTML = `

        <div class="cleanup-item">
          <h3>📱 Phone Number Exposure</h3>

          <p>
            Your phone number is the information you asked Privacy Scout
            to protect.
          </p>

          <span class="cleanup-status">
            🟡 Removal check not performed
          </span>
        </div>

        <div class="cleanup-item">
          <h3>🌐 Data Broker Listings</h3>

          <p>
            Some people-search and data-broker websites may publish
            phone numbers.
          </p>

          <p>
            Privacy Scout has not contacted any of these services.
          </p>

          <span class="cleanup-status">
            🟡 Needs online lookup
          </span>
        </div>

        <div class="cleanup-item">
          <h3>🔎 Search Engine Results</h3>

          <p>
            Your phone number could potentially appear in search results,
            websites, directories, or old posts.
          </p>

          <p>
            No search was performed in this local-only version.
          </p>

          <span class="cleanup-status">
            🟡 Needs online lookup
          </span>
        </div>

        <div class="cleanup-item">
          <h3>🧹 Removal Requests</h3>

          <p>
            Privacy Scout can eventually help prepare removal requests
            for services where your information is found.
          </p>

          <p>
            Nothing will be submitted without your approval.
          </p>

          <span class="cleanup-status">
            🔒 Waiting for your approval
          </span>
        </div>

        <div class="privacy-warning">
          🔐 <strong>Privacy protection:</strong>
          This cleanup plan was created locally. Your phone number
          was not sent to a website, search engine, or third-party service.
        </div>
      `;

      cleanupButton.textContent = "🧹 Cleanup Plan Created";
      cleanupButton.disabled = false;

    }, 700);
  }

});
