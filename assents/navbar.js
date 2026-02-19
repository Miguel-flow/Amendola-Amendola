fetch("navbar.html")
  .then(r => r.text())
  .then(html => {
    const target = document.getElementById("navbar");
    if (target) target.innerHTML = html;
  })
  .catch(err => console.error("Erro ao carregar navbar:", err));