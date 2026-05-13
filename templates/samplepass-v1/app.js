(function () {
  const baseConfig = window.SAMPLEPASS_DESIGN_SYSTEM_V1_CONFIG || {};
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
      (params.get("brand") || baseConfig.SOURCE_ID || "samplepass-design-system-v1")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    QR_ID: params.get("qr") || baseConfig.QR_ID,
  };

  const states = {
    connect: document.querySelector("#state-connect"),
    interact: document.querySelector("#state-interact"),
    connected: document.querySelector("#state-connected"),
  };

  const connectForm = document.querySelector("#connect-form");
  const claimForm = document.querySelector("#samplepass-form");
  const submitButton = document.querySelector("#submit-button");
  const status = document.querySelector("#form-status");
  const nameInput = document.querySelector("#connect-name");
  const phoneInput = document.querySelector("#connect-phone");
  const recognitionBanner = document.querySelector("#recognition-banner");

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

  function normalizePhone(value) {
    return String(value || "").replace(/[^0-9+]/g, "").trim();
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
    status.textContent = message || "";
    status.className = "rb-status";

    if (type) {
      status.classList.add(`is-${type}`);
    }
  }

  function activateState(targetState) {
    Object.values(states).forEach((section) => {
      section.classList.remove("is-active");
    });

    targetState.classList.add("is-active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveVisitorFromForm() {
    const formData = new FormData(connectForm);
    const name = String(formData.get("name") || "").trim();
    const phone = normalizePhone(formData.get("phone"));
    const normalizedPhone = phone.startsWith("+1") ? phone : `+1 ${phone}`;

    localStorage.setItem("ropebridge-connected", "true");
    localStorage.setItem("ropebridge-name", name);
    localStorage.setItem("ropebridge-phone", normalizedPhone.trim());
  }

  function showRecognitionIfAvailable() {
    const visitor = getSavedVisitor();

    if (!recognitionBanner || !visitor.connected) {
      return;
    }

    recognitionBanner.textContent = visitor.name
      ? `Welcome back, ${visitor.name}.`
      : "Welcome back.";
    recognitionBanner.classList.add("is-visible");
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
    showRecognitionIfAvailable();
    activateState(states.interact);
  } else {
    activateState(states.connect);
  }

  connectForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!connectForm.checkValidity()) {
      connectForm.reportValidity();
      return;
    }

    saveVisitorFromForm();
    showRecognitionIfAvailable();
    activateState(states.interact);
  });

  claimForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("", null);

    if (missingConfig.length > 0) {
      setStatus(`Missing Supabase config: ${missingConfig.join(", ")}.`, "error");
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
        design_system: "ropebridge-v1",
      },
    };

    submitButton.disabled = true;
    submitButton.textContent = "Saving...";

    try {
      await submitLead(payload);
      activateState(states.connected);
    } catch (error) {
      console.error(error);
      setStatus("We could not save that yet. Please try again or show this screen to the vendor.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = config.CTA_LABEL || defaultSubmitLabel;
    }
  });
})();
