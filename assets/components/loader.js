async function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`Erro ao carregar: ${file}`);
    el.innerHTML = await res.text();
    console.log(`Componente carregado: ${id}`);
  } catch (err) {
    console.error(err);
  }
}

// Inicializa menu do footer
function initFooter() {
  const button = document.getElementById("langButton");
  const menu = document.getElementById("langMenu");
  const selector = document.getElementById("langSelector");
  const langLinks = document.querySelectorAll("#langMenu a");

  if (!button || !menu || !selector) {
    console.warn("Elementos do footer não encontrados!");
    return;
  }

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!selector.contains(e.target)) menu.classList.remove("active");
  });

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
  const darkButton = document.getElementById("darkModeToggle");
  if (!darkButton) {
    console.warn("Botão de dark mode não encontrado!");
    return;
  }

  const body = document.body;

  // Restaurar estado salvo
  const saved = localStorage.getItem('darkMode') === 'true';
  if (saved) body.classList.add('dark-mode');

  darkButton.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    console.log("Modo escuro:", body.classList.contains("dark-mode"));
  });

  console.log("Dark mode inicializado ✅");
}

// Função para observar quando um elemento é adicionado ao DOM
function onElementReady(selector, callback) {
  const el = document.querySelector(selector);
  if (el) {
    callback(el);
    return;
  }

  const observer = new MutationObserver((mutations, obs) => {
    const el = document.querySelector(selector);
    if (el) {
      callback(el);
      obs.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Função principal
async function loadPage() {
  await loadComponent("contato-area", "assets/components/contato.html");
  await loadComponent("footer-area", "assets/components/footer.html");
  await loadComponent("cookies-area", "assets/components/cookies.html");

  // Espera o footer existir antes de inicializar
  onElementReady("#footer-area", () => {
    initFooter();
    initDarkMode();
  });
}

document.addEventListener("DOMContentLoaded", loadPage);