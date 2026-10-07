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

  const foundCount =
    document.getElementById("foundCount");

  const riskCount =
    document.getElementById("riskCount");

  const safeCount =
    document.getElementById("safeCount");

  const results =
    document.getElementById("results");

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

  let onlineSearchApproved = false;


  scanButton.addEventListener("click", runScan);

  cleanupButton.addEventListener(
    "click",
    createCleanupPlan
  );

  backendButton.addEventListener(
    "click",
    testBackend
  );

  approveSearchButton.addEventListener(
    "click",
    approveOnlineSearch
  );


  /*
   * LOCAL PHONE SCAN
   */

  function runScan() {

    const phone = phoneInput.value.trim();

    if (!phone) {

      status.textContent =
        "Please enter a phone number first.";

      return;
    }

    status.textContent =
      "🔎 Running local privacy scan...";

    scanButton.disabled = true;

    setTimeout(() => {

      const digits =
        phone.replace(/\D/g, "");

      if (digits.length < 7) {

        status.textContent =
          "Please enter a valid phone number.";

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
      `;


      approvalData.textContent =
        "Phone number entered";


      approvalStatus.textContent =
        "🔒 Waiting for your approval.";


      exposureResults.innerHTML = `
        <p>
          No online search has been performed.
        </p>
      `;


      onlineSearchApproved = false;

      approveSearchButton.disabled = false;

      approveSearchButton.textContent =
        "🔐 Approve Online Search";


      status.textContent =
        "✅ Scan complete.";

      scanButton.disabled = false;

    }, 1000);
  }


  /*
   * EXPOSURE FINDER APPROVAL
   *
   * IMPORTANT:
   * This function does NOT send the phone number.
   *
   * It only demonstrates the approval gate.
   */

  function approveOnlineSearch() {

    if (!lastScannedPhone) {

      approvalStatus.textContent =
        "⚠️ Run a phone scan before approving an online search.";

      return;
    }


    onlineSearchApproved = true;

    approveSearchButton.disabled = true;

    approveSearchButton.textContent =
      "✅ Online Search Approved";


    approvalStatus.textContent =
      "🟢 You approved the online search. No search has been performed yet.";


    exposureResults.innerHTML = `

      <div class="cleanup-item">

        <h3>🟢 Permission Granted</h3>

        <p>
          You approved Privacy Scout to perform an online exposure search.
        </p>

        <p>
          <strong>Important:</strong>
          This version has not connected the approved search to a real
          search provider yet.
        </p>

        <span class="cleanup-status">
          🟡 Search service not connected
        </span>

      </div>

      <div class="cleanup-item">

        <h3>🔐 What happens next?</h3>

        <p>
          The next version will send only the information you approved,
          through the Privacy Scout backend.
        </p>

        <span class="cleanup-status">
          🔒 Waiting for search integration
        </span>

      </div>

    `;
  }


  /*
   * CLEANUP PLAN
   */

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

    cleanupButton.textContent =
      "🧹 Building Cleanup Plan...";


    setTimeout(() => {

      cleanupResults.innerHTML = `

        <div class="cleanup-item">

          <h3>📱 Phone Number Exposure</h3>

          <p>
            Your phone number is the information you asked
            Privacy Scout to protect.
          </p>

          <span class="cleanup-status">
            🟡 Online check not performed
          </span>

        </div>


        <div class="cleanup-item">

          <h3>🌐 Data Broker Listings</h3>

          <p>
            Some people-search and data-broker websites may
            publish phone numbers.
          </p>

          <span class="cleanup-status">
            🟡 Online check not performed
          </span>

        </div>


        <div class="cleanup-item">

          <h3>🔎 Search Results</h3>

          <p>
            Public websites, directories, or old posts could
            potentially expose your information.
          </p>

          <span class="cleanup-status">
            🟡 Online check not performed
          </span>

        </div>


        <div class="cleanup-item">

          <h3>🧹 Removal Requests</h3>

          <p>
            Removal requests will only be prepared or submitted
            after you approve them.
          </p>

          <span class="cleanup-status">
            🔒 Waiting for approval
          </span>

        </div>

      `;


      cleanupButton.textContent =
        "🧹 Cleanup Plan Created";

      cleanupButton.disabled = false;

    }, 700);
  }


  /*
   * BACKEND CONNECTION TEST
   */

  async function testBackend() {

    backendButton.disabled = true;

    backendStatus.textContent =
      "🔄 Connecting to Privacy Scout backend...";


    try {

      const response = await fetch(
        API_URL + "/test",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            test: true
          })
        }
      );


      if (!response.ok) {

        throw new Error(
          "Backend returned an error."
        );

      }


      const data =
        await response.json();


      if (data.success) {

        backendStatus.textContent =
          "🟢 Backend connected successfully. No personal information was sent.";

      } else {

        backendStatus.textContent =
          "⚠️ Backend responded, but the test was not successful.";

      }

    } catch (error) {

      backendStatus.textContent =
        "🔴 Could not connect to the backend. Check the Worker and try again.";

    }


    backendButton.disabled = false;
  }

});
