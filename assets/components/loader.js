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
  await loadComponent("footer-area",  "assets/components/footer.html");
  await loadComponent("cookies-area", "assets/components/cookies.html");
});
