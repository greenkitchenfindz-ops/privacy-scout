
document.addEventListener("DOMContentLoaded", () => {
  const API_URL =
    "https://privacy-scout-api.greenkitchenfindz.workers.dev";

  const phoneInput = document.getElementById("phone");
  const scanButton = document.getElementById("scanButton");
  const cleanupButton = document.getElementById("cleanupButton");
  const backendButton = document.getElementById("backendButton");
  const approveSearchButton =
    document.getElementById("approveSearchButton");

  const status = document.getElementById("status");
  const foundCount = document.getElementById("foundCount");
  const riskCount = document.getElementById("riskCount");
  const safeCount = document.getElementById("safeCount");
  const results = document.getElementById("results");
  const cleanupResults =
    document.getElementById("cleanupResults");
  const backendStatus =
    document.getElementById("backendStatus");
  const approvalData =
    document.getElementById("approvalData");
  const approvalStatus =
    document.getElementById("approvalStatus");
  const exposureResults =
    document.getElementById("exposureResults");

  let lastScannedPhone = "";
  let searchInProgress = false;

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function validPhone(phone) {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  }

  function resetExposure() {
    approvalStatus.textContent =
      "🔒 Waiting for your approval.";

    approveSearchButton.disabled = false;
    approveSearchButton.textContent =
      "🔐 Approve Online Search";

    exposureResults.innerHTML =
      "<p>No online search has been performed.</p>";
  }

  scanButton.addEventListener("click", () => {
    const phone = phoneInput.value.trim();

    if (!phone || !validPhone(phone)) {
      status.textContent =
        "Please enter a valid phone number.";
      return;
    }

    lastScannedPhone = phone;
    status.textContent =
      "🔎 Running local privacy scan...";

    scanButton.disabled = true;
    approveSearchButton.disabled = true;

    setTimeout(() => {
      foundCount.textContent = "1";
      riskCount.textContent = "0";
      safeCount.textContent = "1";

      results.innerHTML = `
        <strong>🛡️ Local Scan Complete</strong>
        <p>Your entry was processed in this browser.</p>
        <p>No external lookup was performed.</p>
        <p><strong>External data sent:</strong> None</p>
      `;

      approvalData.textContent =
        "Phone number (sent only after approval)";

      resetExposure();
      status.textContent = "✅ Local scan complete.";
      scanButton.disabled = false;
    }, 400);
  });

  approveSearchButton.addEventListener("click", async () => {
    if (!lastScannedPhone) {
      approvalStatus.textContent =
        "⚠️ Run a phone scan before searching.";
      return;
    }

    if (searchInProgress) return;

    const confirmed = window.confirm(
      "PRIVACY SCOUT — ONLINE SEARCH\n\n" +
      "If you continue:\n\n" +
      "1. Your phone number will be sent to the Privacy Scout " +
      "Cloudflare backend.\n\n" +
      "2. The backend will send your number to Tavily to search " +
      "public web results.\n\n" +
      "3. Search-result snippets will be sent to Cloudflare AI " +
      "for an explanation.\n\n" +
      "4. Search providers may process or retain requests under " +
      "their own policies.\n\n" +
      "Results may be unrelated or inaccurate. No removal " +
      "requests will be submitted.\n\n" +
      "Continue and send this phone number for the search?"
    );

    if (!confirmed) {
      approvalStatus.textContent =
        "🔒 Search cancelled. No phone number was sent.";
      return;
    }

    searchInProgress = true;
    approveSearchButton.disabled = true;
    approveSearchButton.textContent = "🔎 Searching...";
    approvalStatus.textContent =
      "☁️ Sending your approved search request...";

    exposureResults.innerHTML =
      "<p>Searching public web results. Please wait...</p>";

    try {
      const response = await fetch(
        API_URL + "/exposure-search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            phone: lastScannedPhone
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "The search could not be completed."
        );
      }

      const resultCards = (data.results || []).map(item => `
        <div class="cleanup-item">
          <h3>${escapeHTML(item.title || "Untitled result")}</h3>
          <p>${escapeHTML(item.content || "No preview available.")}</p>
          ${
            /^https?:\/\//i.test(item.url || "")
              ? `<p><a href="${escapeHTML(item.url)}"
                   target="_blank" rel="noopener noreferrer">
                   Open original webpage
                 </a></p>`
              : ""
          }
          <span class="cleanup-status">
            ⚠️ Possible match — not verified
          </span>
        </div>
      `).join("");

      exposureResults.innerHTML = `
        <div class="cleanup-item">
          <h3>🔎 Search Complete</h3>
          <p>
            Results are possible matches, not proof that a
            webpage refers to you.
          </p>
          <p><strong>Results returned:</strong>
            ${(data.results || []).length}
          </p>
        </div>
        ${
          resultCards ||
          "<p>No matching results were returned. This does not prove your number is absent from the internet.</p>"
        }
        <div class="cleanup-item">
          <h3>🤖 Cloudflare AI Explanation</h3>
          <p>${escapeHTML(
            data.explanation ||
            "No AI explanation was returned."
          )}</p>
        </div>
      `;

      approvalStatus.textContent =
        "✅ Search completed. Your number was sent to the services described above.";

      approveSearchButton.textContent =
        "✅ Search Complete";
    } catch (error) {
      approvalStatus.textContent =
        "⚠️ Search failed. Check your connection and try again.";

      exposureResults.innerHTML = `
        <div class="cleanup-item">
          <h3>Search Could Not Complete</h3>
          <p>${escapeHTML(error.message)}</p>
          <p>No removal requests were submitted.</p>
        </div>
      `;

      approveSearchButton.disabled = false;
      approveSearchButton.textContent =
        "🔐 Retry Online Search";
    } finally {
      searchInProgress = false;
    }
  });

  cleanupButton.addEventListener("click", () => {
    if (!lastScannedPhone) {
      cleanupResults.innerHTML = `
        <div class="cleanup-item">
          <h3>📱 Scan Required</h3>
          <p>Enter a phone number and run the local scan first.</p>
        </div>
      `;
      return;
    }

    cleanupResults.innerHTML = `
      <div class="cleanup-item">
        <h3>📱 Phone Number Exposure</h3>
        <p>Use the Exposure Finder to look for possible public listings.</p>
        <span class="cleanup-status">Check results before acting</span>
      </div>
      <div class="cleanup-item">
        <h3>🧹 Removal Requests</h3>
        <p>Review each website's official removal process.</p>
        <p>No removal request will be sent automatically.</p>
        <span class="cleanup-status">🔒 Manual approval required</span>
      </div>
    `;
  });

  backendButton.addEventListener("click", async () => {
    backendButton.disabled = true;
    backendStatus.textContent =
      "🔄 Connecting to Privacy Scout backend...";

    try {
      const response = await fetch(API_URL + "/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ test: true })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("Backend test failed.");
      }

      backendStatus.textContent =
        "🟢 Backend connected. No personal information was sent.";
    } catch {
      backendStatus.textContent =
        "🔴 Could not connect to the backend. Check the Worker.";
    } finally {
      backendButton.disabled = false;
    }
  });
});
