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

// Deixa global para chamar do loader
window.initFooter = initFooter;



setTimeout(() => {
  const button = document.getElementById("langButton");
  const menu = document.getElementById("langMenu");

  console.log("button:", button);
  console.log("menu:", menu);

  if(button && menu){
    button.addEventListener("click", () => {
      console.log("clicou");
      menu.classList.toggle("active");
    });
  } else {
    console.log("button ou menu não encontrados ainda!");
  }
}, 50);
