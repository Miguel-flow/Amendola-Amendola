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

// Inicializa o menu de idiomas no footer
function initFooter() {
  const button = document.getElementById("langButton");
  const menu = document.getElementById("langMenu");
  const selector = document.getElementById("langSelector");
  const langLinks = document.querySelectorAll("#langMenu a");

  if (!button || !menu || !selector) {
    console.warn("Footer não inicializado: elementos não encontrados");
    return;
  }

  // Abrir / fechar menu
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("active");
  });

  // Fechar menu ao clicar fora
  document.addEventListener("click", (e) => {
    if (!selector.contains(e.target)) {
      menu.classList.remove("active");
    }
  });

  // Trocar idioma ao clicar
  langLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const lang = link.dataset.lang;
      if (typeof translatePage === "function") translatePage(lang);
      menu.classList.remove("active");
    });
  });

  console.log("Footer inicializado ✅");
}

// Inicializa botão de dark mode
function initDarkMode() {
  const darkButton = document.getElementById("darkModeToggle"); // ajuste se usar outro ID
  if (!darkButton) {
    console.warn("Botão de dark mode não encontrado!");
    return;
  }

  const body = document.body;
  darkButton.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    darkButton.textContent = body.classList.contains('dark-mode')
      ? 'Desativar Modo Escuro'
      : 'Ativar Modo Escuro';
    console.log("Clique no botão de dark mode detectado ✅");
  });
}

// Função principal que carrega todos os componentes
async function loadPage() {
  await loadComponent("contato-area", "assets/components/contato.html");
  await loadComponent("footer-area", "assets/components/footer.html");

  // Footer já existe, inicializa
  if (typeof window.initFooter === "function") {
    window.initFooter();
  } else {
    console.warn("initFooter não definido!");
  }

  // Inicializa dark mode
  initDarkMode();

  await loadComponent("cookies-area", "assets/components/cookies.html");
}

document.addEventListener("DOMContentLoaded", loadPage);