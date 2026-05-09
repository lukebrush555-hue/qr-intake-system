(function () {
  const config = window.SAMPLEPASS_DEMO_CONFIG || {};

  const connectState = document.querySelector("#state-connect");
  const interactState = document.querySelector("#state-interact");
  const connectedState = document.querySelector("#state-connected");

  const connectForm = document.querySelector("#connect-form");
  const claimForm = document.querySelector("#samplepass-form");
  const submitButton = document.querySelector("#submit-button");
  const status = document.querySelector("#form-status");

  const requiredConfig = ["SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY"];
  const missingConfig = requiredConfig.filter((key) => !config[key]);

  const defaultSubmitLabel = submitButton.textContent.trim();

  document.querySelectorAll("[data-config-text]").forEach((element) => {
    const value = config[element.dataset.configText];

    if (value) {
      element.textContent = value;
    }
  });

  document.querySelectorAll("[data-config-src]").forEach((element) => {
    const value = config[element.dataset.configSrc];

    if (value) {
      element.setAttribute("src", value);
    }
  });

  document.querySelectorAll("[data-config-alt]").forEach((element) => {
    const value = config[element.dataset.configAlt];

    if (value) {
      element.setAttribute("alt", value);
    }
  });

  if (config.SOCIAL_LINKS) {
    document.querySelectorAll("[data-social]").forEach((link) => {
      const key = link.dataset.social;
      const value = config.SOCIAL_LINKS[key];

      if (value) {
        link.href = value;
        link.target = "_blank";
        link.rel = "noreferrer";
      } else {
        link.remove();
      }
    });
  }

  function setStatus(message, type) {
    status.textContent = message;
    status.className = "form-status";

    if (type) {
      status.classList.add(type);
    }
  }

  function activateState(targetState) {
    [connectState, interactState, connectedState].forEach((section) => {
      section.classList.remove("active-state");
    });

    targetState.classList.add("active-state");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submitLead(payload) {
    const endpoint = `${config.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/lead_requests`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: config.SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${config.SUPABASE_PUBLISHABLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Lead request insert failed.");
    }
  }

  connectForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!connectForm.checkValidity()) {
      connectForm.reportValidity();
      return;
    }

    localStorage.setItem("ropebridge-connected", "true");
    activateState(interactState);
  });

  claimForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("", null);

    if (missingConfig.length > 0) {
      setStatus(`Missing Supabase config: ${missingConfig.join(", ")}.`);
      return;
    }

    const payload = {
      project_type: config.PROJECT_TYPE,
      template_id: config.TEMPLATE_ID,
      source_id: config.SOURCE_ID,
      qr_id: config.QR_ID,
      name: "SamplePass Visitor",
      phone: localStorage.getItem("ropebridge-phone") || "pending-connect",
      business_name: config.BRAND_NAME,
      metadata: {
        product: config.PRODUCT_NAME,
      },
    };

    submitButton.disabled = true;
    submitButton.textContent = "Saving...";

    try {
      await submitLead(payload);
      activateState(connectedState);
    } catch (error) {
      console.error(error);
      setStatus("Something went wrong. Please try again.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = config.CTA_LABEL || defaultSubmitLabel;
    }
  });
})();
