document.addEventListener("DOMContentLoaded", () => {
  const target = document.getElementById("navbar");
  if (!target) return;

  fetch("navbar.html")
    .then(r => r.text())
    .then(html => {
      target.innerHTML = html;
    })
    .catch(err => console.error("Erro navbar:", err));
});

