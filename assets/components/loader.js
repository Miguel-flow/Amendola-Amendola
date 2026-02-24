// =============================
// 🔥 1. APLICAR TEMA IMEDIATAMENTE (anti-pisque)
// =============================
(function applyThemeEarly() {
  const saved = localStorage.getItem("darkMode") === "true";
  if (saved) {
    document.documentElement.classList.add("dark-mode");
  }
})();


// =============================
// 📦 2. FUNÇÃO PARA CARREGAR COMPONENTES
// =============================
async function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`Erro ao carregar: ${file}`);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error(err);
  }
}


// =============================
// 🌍 3. FOOTER (IDIOMA)
// =============================
function initFooter() {
  const button = document.getElementById("langButton");
  const menu = document.getElementById("langMenu");
  const selector = document.getElementById("langSelector");

  if (!button || !menu || !selector) return;

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!selector.contains(e.target)) {
      menu.classList.remove("active");
    }
  });
}


// =============================
// 🌙 DARK MODE (corrigido)
// =============================
function initDarkMode() {

  const toggle = document.getElementById("darkModeToggle");

  const isSavedDark = localStorage.getItem("darkMode") === "true";

  if (isSavedDark) {
    document.documentElement.classList.add("dark-mode");
  }

  if (!toggle) return;

  toggle.addEventListener("click", function () {

    const isDark = document.documentElement.classList.toggle("dark-mode");

    localStorage.setItem("darkMode", isDark);

    console.log("Modo escuro:", isDark);
  });
}


// =============================
// 🚀 5. INICIALIZAÇÃO GERAL
// =============================
async function initPage() {
  await Promise.all([
    loadComponent("contato-area", "assets/components/contato.html"),
    loadComponent("footer-area", "assets/components/footer.html"),
    loadComponent("cookies-area", "assets/components/cookies.html")
  ]);

  initFooter();
  initDarkMode(); // ← IMPORTANTE
}

document.addEventListener("DOMContentLoaded", initPage);