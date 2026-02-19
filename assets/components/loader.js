async function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  const res = await fetch(file);
  if (!res.ok) {
    console.error("Erro ao carregar:", file);
    return;
  }

  el.innerHTML = await res.text();
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("contato-area", "assets/components/contato.html");

await loadComponent("footer-area", "assets/components/footer.html");

// espera um pequeno delay para garantir que o DOM está pronto
setTimeout(() => {
  const button = document.getElementById("langButton");
  const menu = document.getElementById("langMenu");
  const selector = document.getElementById("langSelector");

  if (!button || !menu || !selector) {
    console.error("Elementos do footer não encontrados!");
    return;
  }

  // adicionar listeners
  button.addEventListener("click", () => menu.classList.toggle("active"));
  document.addEventListener("click", (e) => {
    if (!selector.contains(e.target)) menu.classList.remove("active");
  });

  const langLinks = document.querySelectorAll("#langMenu a");
  langLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const lang = link.dataset.lang;
      if (typeof translatePage === "function") translatePage(lang);
      menu.classList.remove("active");
    });
  });

  console.log("Footer inicializado ✅");

}, 50); // 50ms é suficiente para o DOM renderizar


  await loadComponent("cookies-area", "assets/components/cookies.html");
});
