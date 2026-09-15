import { carregarColecao } from "./firebase.js";
import {
  SISTEMAS, normalizar, digitos, escapeHtml, urlSegura, hostSite,
  iniciais, ordenarLinks, compararNome
} from "./cadastros.js";

const input = document.getElementById("clienteSearch");
const grid = document.getElementById("clientesGrid");
const count = document.getElementById("cliCount");
const total = document.getElementById("cliTotal");
const empty = document.getElementById("clientesEmpty");
const loading = document.getElementById("clientesLoading");

function compact(texto) {
  return normalizar(texto).replace(/[^a-z0-9]+/g, "");
}

function textoBusca(cliente) {
  return [
    cliente.nome, hostSite(cliente.site), digitos(cliente.cnpj), digitos(cliente.telefone)
  ].filter(Boolean).join(" ");
}

function montarLink(link) {
  const url = urlSegura(link.url);
  if (!url) return "";

  const sistema = SISTEMAS[link.tipo];
  const classe = sistema ? ` sys-${link.tipo}` : "";
  const icone = link.icone || (sistema && sistema.icone) || "fa-link";
  const rotulo = link.rotulo || (sistema && sistema.rotulo) || "Link";

  return `<a class="sys-link${classe}" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">`
    + `<i class="fa-solid ${escapeHtml(icone)}"></i>${escapeHtml(rotulo)}</a>`;
}

function montarCard(cliente) {
  const card = document.createElement("article");
  card.className = "cliente-card";
  card.dataset.search = textoBusca(cliente);
  card.setAttribute("data-sr", "fade");

  const site = urlSegura(cliente.site);
  const tel = digitos(cliente.telefone);

  card.innerHTML = `
    <div class="cliente-top">
      <span class="cliente-badge">${escapeHtml(iniciais(cliente.nome))}</span>
      <div class="cliente-info">
        <h3 class="cliente-name">${escapeHtml(cliente.nome)}</h3>
      </div>
    </div>
    <div class="cliente-meta">
      ${site ? `<a href="${escapeHtml(site)}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-globe"></i><span>${escapeHtml(hostSite(site))}</span></a>` : ""}
      ${tel ? `<a href="tel:+55${tel}"><i class="fa-solid fa-phone"></i><span>${escapeHtml(cliente.telefone)}</span></a>` : ""}
      ${cliente.cnpj ? `<span class="cliente-cnpj"><i class="fa-solid fa-id-card"></i><span>${escapeHtml(cliente.cnpj)}</span></span>` : ""}
    </div>
    <div class="cliente-links">${ordenarLinks(cliente.links).map(montarLink).join("")}</div>
  `;
  return card;
}

function renderizar(clientes) {
  const cards = [];
  const groups = [];
  let current = null;

  clientes.forEach((cliente) => {
    const card = montarCard(cliente);
    const letter = normalizar(cliente.nome.trim().charAt(0)).toUpperCase();

    if (!current || current.letter !== letter) {
      const sep = document.createElement("div");
      sep.className = "letter-sep";
      sep.innerHTML = '<span class="letter"></span><span class="line"></span><span class="letter-count"></span>';
      sep.querySelector(".letter").textContent = letter;
      grid.appendChild(sep);
      current = { letter, sep, cards: [] };
      groups.push(current);
    }

    grid.appendChild(card);
    current.cards.push(card);
    cards.push(card);
  });

  function updateSeps() {
    groups.forEach((g) => {
      const visible = g.cards.filter((c) => !c.hidden).length;
      g.sep.hidden = visible === 0;
      g.sep.querySelector(".letter-count").textContent = visible + (visible === 1 ? " cliente" : " clientes");
    });
  }

  function filter() {
    const raw = input.value.trim();
    const q = normalizar(raw);
    const qc = compact(raw);
    let visible = 0;

    cards.forEach((card) => {
      const hay = card.dataset.search;
      const match = !raw || normalizar(hay).includes(q) || (qc && compact(hay).includes(qc));
      card.hidden = !match;
      if (match) visible++;
    });

    count.textContent = visible;
    empty.hidden = visible !== 0;
    updateSeps();
  }

  total.textContent = clientes.length;
  input.addEventListener("input", filter);
  filter();

  // Sem o scroll-reveal novo (ex.: versao antiga em cache), mostra os cards
  // direto em vez de deixa-los invisiveis.
  if (window.srObserve) window.srObserve(grid);
  else grid.querySelectorAll("[data-sr]").forEach((el) => el.classList.add("sr-visible"));
}

carregarColecao("clientes", "data/clientes.json")
  .then(({ dados }) => {
    loading.hidden = true;
    renderizar(dados.filter((c) => c && c.nome).sort(compararNome));
  })
  .catch((err) => {
    console.error(err);
    loading.hidden = true;
    empty.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Não foi possível carregar os clientes. Tente novamente em instantes.';
    empty.hidden = false;
  });
