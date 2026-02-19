function initCookies(){
  const KEY = "amendola_cookie_consent_v1";

  function getConsent(){
    try { return JSON.parse(localStorage.getItem(KEY)); }
    catch(e){ return null; }
  }

  function setConsent(consent){
    localStorage.setItem(KEY, JSON.stringify(consent));
  }

  function hasConsent(){
    const c = getConsent();
    return !!(c && c.aceito === true);
  }

  function showBanner(){
    const banner = document.getElementById("cookie-banner");
    if(!banner) return;
    banner.style.display = hasConsent() ? "none" : "block";
  }

  function applyConsent(){
    const c = getConsent() || {};
    const mapIframe = document.querySelector(".map-box iframe");

    if(mapIframe){
      if(!mapIframe.dataset.src){
        mapIframe.dataset.src = mapIframe.getAttribute("src") || "";
        mapIframe.removeAttribute("src");
      }
      c.functional
        ? mapIframe.setAttribute("src", mapIframe.dataset.src)
        : mapIframe.removeAttribute("src");
    }
  }

  window.configurarCookies = function(){
    const c = getConsent() || {};
    document.getElementById("functional").checked = !!c.functional;
    document.getElementById("analytics").checked  = !!c.analytics;
    document.getElementById("marketing").checked  = !!c.marketing;
    document.getElementById("cookie-modal-overlay").style.display = "flex";
  };

  window.fecharModal = function(){
    document.getElementById("cookie-modal-overlay").style.display = "none";
  };

  window.salvarCookies = function(){
    setConsent({
      aceito: true,
      functional: document.getElementById("functional").checked,
      analytics: document.getElementById("analytics").checked,
      marketing: document.getElementById("marketing").checked,
      data: new Date().toISOString(),
      versao: "v1"
    });
    fecharModal();
    showBanner();
    applyConsent();
  };

  window.aceitarCookies = function(){
    setConsent({
      aceito: true,
      functional: true,
      analytics: true,
      marketing: true,
      data: new Date().toISOString(),
      versao: "v1"
    });
    fecharModal();
    showBanner();
    applyConsent();
  };

  window.rejeitarCookies = function(){
    setConsent({
      aceito: true,
      functional: false,
      analytics: false,
      marketing: false,
      data: new Date().toISOString(),
      versao: "v1"
    });
    fecharModal();
    showBanner();
    applyConsent();
  };

  showBanner();
  applyConsent();
}

const waitCookies = setInterval(() => {
  if (document.getElementById("cookie-banner")) {
    clearInterval(waitCookies);
    initCookies();
  }
}, 50);
