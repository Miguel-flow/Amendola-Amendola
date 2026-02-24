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
// 🌙 4. DARK MODE (à prova de async)
// =============================
document.addEventListener("click", function (e) {
  const btn = e.target.closest("#darkModeToggle");
  if (!btn) return;

  document.documentElement.classList.toggle("dark-mode");

  const isDark = document.documentElement.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark);

  console.log("Modo escuro:", isDark);
});


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
}

document.addEventListener("DOMContentLoaded", initPage);