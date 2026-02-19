document.addEventListener("DOMContentLoaded", () => {
  const target = document.getElementById("footer");
  if (!target) return;

  fetch("footer.html")
    .then(r => r.text())
    .then(html => target.innerHTML = html)
    .catch(err => console.error("Erro footer:", err));
});
