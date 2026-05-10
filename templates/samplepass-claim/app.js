(function () {
  const baseConfig = window.SAMPLEPASS_DEMO_CONFIG || {};
  const params = new URLSearchParams(window.location.search);

  const config = {
    ...baseConfig,
    BRAND_NAME: params.get("brand") || baseConfig.BRAND_NAME,
    PRODUCT_CATEGORY: params.get("category") || baseConfig.PRODUCT_CATEGORY,
    PRODUCT_NAME: params.get("product") || baseConfig.PRODUCT_NAME,
    PRODUCT_DESCRIPTION: params.get("description") || baseConfig.PRODUCT_DESCRIPTION,
    CTA_LABEL: params.get("cta") || baseConfig.CTA_LABEL,
    SOURCE_ID:
      params.get("source") ||
      (params.get("brand") || baseConfig.SOURCE_ID || "samplepass-demo")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    QR_ID: params.get("qr") || baseConfig.QR_ID,
  };

  const connectState = document.querySelector("#state-connect");
  const interactState = document.querySelector("#state-interact");
  const connectedState = document.querySelector("#state-connected");

  const connectForm = document.querySelector("#connect-form");
  const claimForm = document.querySelector("#samplepass-form");
  const submitButton = document.querySelector("#submit-button");
  const status = document.querySelector("#form-status");
  const nameInput = document.querySelector("#connect-name");
  const phoneInput = document.querySelector("#connect-phone");

  const requiredConfig = ["SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY"];
  const missingConfig = requiredConfig.filter((key) => !config[key]);

  const defaultSubmitLabel = submitButton.textContent.trim();

  function getSavedVisitor() {
    return {
      connected: localStorage.getItem("ropebridge-connected") === "true",
      name: localStorage.getItem("ropebridge-name") || "",
      phone: localStorage.getItem("ropebridge-phone") || "",
    };
  }

  function applyConfigText() {
    document.querySelectorAll("[data-config-text]").forEach((element) => {
      const value = config[element.dataset.configText];

      if (value) {
        element.textContent = value;
      }
    });
  }

  function applyConfigAssets() {
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
  }

  function applySocialLinks() {
    if (!config.SOCIAL_LINKS) {
      return;
    }

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

  function saveVisitorFromForm() {
    const formData = new FormData(connectForm);
    const name = String(formData.get("name") || "").trim();
    const countryCode = String(formData.get("country_code") || "+1").trim();
    const phone = String(formData.get("phone") || "").trim();

    localStorage.setItem("ropebridge-connected", "true");
    localStorage.setItem("ropebridge-name", name);
    localStorage.setItem("ropebridge-phone", `${countryCode} ${phone}`.trim());
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

  applyConfigText();
  applyConfigAssets();
  applySocialLinks();

  const savedVisitor = getSavedVisitor();

  if (savedVisitor.name && nameInput) {
    nameInput.value = savedVisitor.name;
  }

  if (savedVisitor.phone && phoneInput) {
    phoneInput.value = savedVisitor.phone.replace(/^\+1\s*/, "");
  }

  if (savedVisitor.connected && savedVisitor.phone) {
    activateState(interactState);
  } else {
    activateState(connectState);
  }

  connectForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!connectForm.checkValidity()) {
      connectForm.reportValidity();
      return;
    }

    saveVisitorFromForm();
    activateState(interactState);
  });

  claimForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("", null);

    if (missingConfig.length > 0) {
      setStatus(`Missing Supabase config: ${missingConfig.join(", ")}.`);
      return;
    }

    const visitor = getSavedVisitor();

    const payload = {
      project_type: config.PROJECT_TYPE,
      template_id: config.TEMPLATE_ID,
      source_id: config.SOURCE_ID,
      qr_id: config.QR_ID,
      name: visitor.name || "SamplePass Visitor",
      phone: visitor.phone || "pending-connect",
      business_name: config.BRAND_NAME,
      metadata: {
        product: config.PRODUCT_NAME,
        category: config.PRODUCT_CATEGORY,
        remembered: visitor.connected,
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
