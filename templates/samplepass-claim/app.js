(function () {
  const config = window.SAMPLEPASS_DEMO_CONFIG || {};
  const form = document.querySelector("#samplepass-form");
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

  function setStatus(message, type) {
    status.textContent = message;
    status.className = "form-status";

    if (type) {
      status.classList.add(type);
    }
  }

  function readField(name) {
    return new FormData(form).get(name).trim();
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

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("", null);

    if (missingConfig.length > 0) {
      setStatus(
        `Missing Supabase config: ${missingConfig.join(", ")}.`,
        "error",
      );
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const notes = readField("notes");
    const payload = {
      project_type: config.PROJECT_TYPE,
      template_id: config.TEMPLATE_ID,
      source_id: config.SOURCE_ID,
      qr_id: config.QR_ID,
      name: readField("name"),
      phone: readField("phone"),
      business_name: readField("business_name"),
      metadata: {
        free_item: config.FREE_ITEM,
        notes,
      },
    };

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    setStatus("Sending your request...", null);

    try {
      await submitLead(payload);
      form.reset();
      setStatus(config.SUCCESS_MESSAGE, "success");
    } catch (error) {
      setStatus("Something went wrong. Please try again.", "error");
      console.error(error);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = config.CTA_LABEL || defaultSubmitLabel;
    }
  });
})();
