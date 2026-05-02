function initCookies() {
  const KEY = "amendola_cookie_consent_v2";
  const DEFAULT_CONSENT = {
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  };

  function getConsent() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (!saved || saved.version !== "v2" || !saved.decisionAt) return null;
      return { ...DEFAULT_CONSENT, ...saved, necessary: true };
    } catch (error) {
      return null;
    }
  }

  function setConsent(consent) {
    localStorage.setItem(KEY, JSON.stringify({
      ...DEFAULT_CONSENT,
      ...consent,
      necessary: true,
      version: "v2",
      decisionAt: new Date().toISOString()
    }));
  }

  function hasDecision() {
    return !!getConsent();
  }

  function showBanner() {
    const banner = document.getElementById("cookie-banner");
    if (!banner) return;
    banner.style.display = hasDecision() ? "none" : "block";
  }

  function setCheckbox(id, checked) {
    const field = document.getElementById(id);
    if (field) field.checked = !!checked;
  }

  function readCheckbox(id) {
    const field = document.getElementById(id);
    return !!(field && field.checked);
  }

  function ensureEmbedPlaceholder(iframe) {
    const next = iframe.nextElementSibling;
    if (next && next.classList.contains("cookie-embed-placeholder")) return next;

    const placeholder = document.createElement("div");
    placeholder.className = "cookie-embed-placeholder";
    placeholder.setAttribute("role", "note");

    const title = document.createElement("strong");
    title.textContent = "Conteúdo de terceiros bloqueado";

    const description = document.createElement("span");
    description.textContent = "Ative cookies funcionais para carregar este recurso externo.";

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Configurar cookies";
    button.addEventListener("click", () => window.configurarCookies());

    placeholder.append(title, description, button);
    iframe.insertAdjacentElement("afterend", placeholder);
    return placeholder;
  }

  function applyThirdPartyEmbeds(functionalAllowed) {
    document.querySelectorAll("iframe[data-src], iframe[data-cookie-category='functional']").forEach((iframe) => {
      if (!iframe.dataset.src) {
        const currentSrc = iframe.getAttribute("src");
        if (currentSrc) iframe.dataset.src = currentSrc;
      }

      const placeholder = ensureEmbedPlaceholder(iframe);

      if (functionalAllowed && iframe.dataset.src) {
        iframe.hidden = false;
        iframe.setAttribute("src", iframe.dataset.src);
        placeholder.hidden = true;
        return;
      }

      iframe.removeAttribute("src");
      iframe.hidden = true;
      placeholder.hidden = false;
    });
  }

  function applyConsent() {
    const consent = getConsent() || DEFAULT_CONSENT;
    applyThirdPartyEmbeds(!!consent.functional);

    document.documentElement.dataset.cookieFunctional = consent.functional ? "true" : "false";
    document.documentElement.dataset.cookieAnalytics = consent.analytics ? "true" : "false";
    document.documentElement.dataset.cookieMarketing = consent.marketing ? "true" : "false";

    window.dispatchEvent(new CustomEvent("amendolaCookieConsentChange", {
      detail: consent
    }));
  }

  window.configurarCookies = function configurarCookies() {
    const overlay = document.getElementById("cookie-modal-overlay");
    if (!overlay) return;

    const consent = getConsent() || DEFAULT_CONSENT;
    setCheckbox("functional", consent.functional);
    setCheckbox("analytics", consent.analytics);
    setCheckbox("marketing", consent.marketing);
    overlay.style.display = "flex";
  };

  window.fecharModal = function fecharModal() {
    const overlay = document.getElementById("cookie-modal-overlay");
    if (overlay) overlay.style.display = "none";
  };

  window.salvarCookies = function salvarCookies() {
    setConsent({
      functional: readCheckbox("functional"),
      analytics: readCheckbox("analytics"),
      marketing: readCheckbox("marketing"),
      choice: "custom"
    });
    fecharModal();
    showBanner();
    applyConsent();
  };

  window.aceitarCookies = function aceitarCookies() {
    setConsent({
      functional: true,
      analytics: true,
      marketing: true,
      choice: "accept_all"
    });
    fecharModal();
    showBanner();
    applyConsent();
  };

  window.rejeitarCookies = function rejeitarCookies() {
    setConsent({
      functional: false,
      analytics: false,
      marketing: false,
      choice: "reject_optional"
    });
    fecharModal();
    showBanner();
    applyConsent();
  };

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") fecharModal();
  });

  const overlay = document.getElementById("cookie-modal-overlay");
  if (overlay) {
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) fecharModal();
    });
  }

  const embedObserver = new MutationObserver((mutations) => {
    const hasNewEmbed = mutations.some((mutation) => Array.from(mutation.addedNodes).some((node) => {
      if (node.nodeType !== 1) return false;
      return node.matches?.("iframe[data-src], iframe[data-cookie-category='functional']") ||
        node.querySelector?.("iframe[data-src], iframe[data-cookie-category='functional']");
    }));

    if (hasNewEmbed) applyConsent();
  });

  if (document.body) {
    embedObserver.observe(document.body, { childList: true, subtree: true });
  }

  showBanner();
  applyConsent();
}

const waitCookies = setInterval(() => {
  if (document.getElementById("cookie-banner")) {
    clearInterval(waitCookies);
    initCookies();
  }
}, 50);
