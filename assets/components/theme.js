// assets/js/theme.js
(() => {
    const KEY = "theme";
  
    function computeTheme() {
      const saved = localStorage.getItem(KEY);
      if (saved === "dark" || saved === "light") return saved;
      const prefersDark = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }
  
    function setTheme(theme) {
      document.body.classList.toggle("dark-mode", theme === "dark");
      localStorage.setItem(KEY, theme);
      syncButton(theme);
    }
  
    function syncButton(theme) {
      const btn = document.getElementById("themeToggle");
      if (!btn) return;
  
      const icon = btn.querySelector(".theme-icon");
      if (icon) icon.textContent = theme === "dark" ? "🌙" : "☀️";
  
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
      );
    }
  
    // aplica tema imediatamente (mesmo antes do footer existir)
    setTheme(computeTheme());
  
    // ✅ Clique funciona mesmo se o botão for inserido depois (footer injetado)
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("#themeToggle");
      if (!btn) return;
  
      const isDark = document.body.classList.contains("dark-mode");
      setTheme(isDark ? "light" : "dark");
    });
  
    // ✅ quando o footer aparecer, atualiza o ícone automaticamente
    const obs = new MutationObserver(() => {
      syncButton(computeTheme());
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  })();

  // ✅ Injeta CSS global da NAVBAR (vence style.css e sistemas.css)
(function ensureNavbarDarkCSS(){
  const STYLE_ID = "navbar-dark-css";
  if (document.getElementById(STYLE_ID)) return;

  const css = `
    body.dark-mode nav.navbar,
    body.dark-mode .navbar{
      background: #0f0f0f !important;
      background-image: none !important;
      border: none !important;
      box-shadow: none !important;
      filter: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      opacity: 1 !important;
    }

    body.dark-mode .navbar::before,
    body.dark-mode .navbar::after{
      content: none !important;
      display: none !important;
    }

    body.dark-mode .navbar a{ color: #ffffff !important; }
    body.dark-mode .navbar a:hover{ color: #ff7a00 !important; }

    body.dark-mode .btn-flowdocs{
      background: #ff7a00 !important;
      color: #ffffff !important;
      border: none !important;
    }
  `;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = css;
  document.head.appendChild(style);
})();
