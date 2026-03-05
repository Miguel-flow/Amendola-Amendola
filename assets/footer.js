function initFooter() {
  const button = document.getElementById("langButton");
  const menu = document.getElementById("langMenu");
  const selector = document.getElementById("langSelector");
  const langLinks = document.querySelectorAll("#langMenu a");

  if (!button || !menu || !selector) {
    console.warn("Footer não inicializado: elementos não encontrados");
    return;
  }

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!selector.contains(e.target)) {
      menu.classList.remove("active");
    }
  });

  console.log("Footer inicializado ✅");
}

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
