// =============================
// 🔥 1. APLICAR TEMA IMEDIATAMENTE (anti-pisca)
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
    return true; // Retorna true para confirmar que carregou
  } catch (err) {
    console.error(err);
    return false;
  }
}

// =============================
// 🌙 DARK MODE (Atualizado para Delegação)
// =============================
function initDarkMode() {
  // Usamos delegação de evento no document para que funcione 
  // mesmo se a navbar for injetada depois
  document.addEventListener("click", (e) => {
    const toggle = e.target.closest("#darkModeToggle");
    if (!toggle) return;

    const isDark = document.documentElement.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", isDark);
    console.log("Modo escuro:", isDark);
  });
}

// =============================
// 📱 NAVBAR (Menu Mobile)
// =============================
function initNavbarLogic() {
  document.addEventListener('click', (e) => {
    const menuIcon = e.target.closest('#mobile-menu-icon');
    const navMenu = document.getElementById('navbar-menu');

    // Abre/Fecha Menu
    if (menuIcon && navMenu) {
      navMenu.classList.toggle('active');
      menuIcon.classList.toggle('open');
    }

    // Fecha ao clicar em link
    if (e.target.closest('.navbar-links a') && navMenu) {
      navMenu.classList.remove('active');
    }
  });
}

// =============================
// 🌍 3. FOOTER (IDIOMA)
// =============================
function initFooter() {
  document.addEventListener("click", (e) => {
    const button = e.target.closest("#langButton");
    const menu = document.getElementById("langMenu");
    const selector = document.getElementById("langSelector");

    if (button && menu) {
      e.stopPropagation();
      menu.classList.toggle("active");
    } else if (menu && selector && !selector.contains(e.target)) {
      menu.classList.remove("active");
    }
  });
}

// =============================
// 🚀 5. INICIALIZAÇÃO GERAL
// =============================
async function initPage() {
  // Incluí a navbar aqui para centralizar o carregamento
  await Promise.all([
    loadComponent("navbar-area", "assets/components/navbar.html"), // Ajuste o caminho se necessário
    loadComponent("contato-area", "assets/components/contato.html"),
    loadComponent("footer-area", "assets/components/footer.html"),
    loadComponent("cookies-area", "assets/components/cookies.html")
  ]);

  initNavbarLogic(); // Inicia lógica da navbar
  initFooter();      // Inicia lógica do footer
  initDarkMode();    // Inicia lógica do dark mode
}

document.addEventListener("DOMContentLoaded", initPage);