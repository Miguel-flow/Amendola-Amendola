// Painel admin: login (Firebase Authentication) + cadastro de clientes e
// links rapidos (Firestore). Quem pode gravar e decidido em firestore.rules.
import { app, db, configurado } from "./firebase.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, sendPasswordResetEmail, signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {
  collection, doc, getDoc, getDocs, setDoc, deleteDoc, writeBatch
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import {
  SISTEMAS, CATEGORIAS_LINK, CORES_LINK, slug, normalizar, digitos, escapeHtml,
  urlSegura, hostSite, iniciais, classeIcone, ordenarLinks, compararNome, formatarCnpj, formatarTelefone
} from "./cadastros.js";

const $ = (id) => document.getElementById(id);

let clientes = [];
let links = [];

// ---------------------------------------------------------------- telas

const TELAS = ["telaCarregando", "telaConfig", "telaLogin", "telaSemPermissao", "telaPainel"];

function mostrar(tela) {
  TELAS.forEach((t) => { $(t).hidden = t !== tela; });
}

let toastTimer;
function avisar(mensagem, tipo = "ok") {
  const toast = $("toast");
  toast.textContent = mensagem;
  toast.className = `admin-toast ${tipo}`;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 4000);
}

function mensagemErro(err) {
  const code = String(err && err.code || "");
  if (code.includes("permission-denied")) return "Sem permissão para gravar. Confira se seu usuário está na coleção admins.";
  if (code.includes("unavailable")) return "Sem conexão com o Firebase. Tente novamente.";
  return (err && err.message) || "Erro inesperado.";
}

function erroLogin(err) {
  switch (err.code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "E-mail ou senha incorretos.";
    case "auth/invalid-email":
      return "E-mail inválido.";
    case "auth/missing-password":
      return "Digite a senha.";
    case "auth/too-many-requests":
      return "Muitas tentativas. Aguarde alguns minutos e tente de novo.";
    case "auth/network-request-failed":
      return "Sem conexão. Verifique a internet.";
    default:
      return mensagemErro(err);
  }
}

// ---------------------------------------------------------------- auth

if (!configurado) {
  mostrar("telaConfig");
} else {
  const auth = getAuth(app);

  $("formLogin").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const botao = ev.currentTarget.querySelector("[type=submit]");
    $("loginErro").hidden = true;
    botao.disabled = true;
    try {
      await signInWithEmailAndPassword(auth, $("loginEmail").value.trim(), $("loginSenha").value);
      $("loginSenha").value = "";
    } catch (err) {
      $("loginErro").textContent = erroLogin(err);
      $("loginErro").hidden = false;
    } finally {
      botao.disabled = false;
    }
  });

  $("btnEsqueci").addEventListener("click", async () => {
    const email = $("loginEmail").value.trim();
    $("loginErro").hidden = true;
    if (!email) {
      $("loginErro").textContent = "Digite seu e-mail no campo acima e clique de novo.";
      $("loginErro").hidden = false;
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      avisar("Se o e-mail estiver cadastrado, você vai receber um link para criar nova senha.");
    } catch (err) {
      $("loginErro").textContent = erroLogin(err);
      $("loginErro").hidden = false;
    }
  });

  document.querySelectorAll("[data-sair]").forEach((botao) => {
    botao.addEventListener("click", () => signOut(auth));
  });

  onAuthStateChanged(auth, async (user) => {
    $("usuarioBox").hidden = !user;
    if (!user) {
      clientes = [];
      links = [];
      mostrar("telaLogin");
      return;
    }

    $("usuarioEmail").textContent = user.email || "";
    $("uidAtual").textContent = user.uid;
    mostrar("telaCarregando");

    try {
      const admin = await getDoc(doc(db, "admins", user.uid));
      if (!admin.exists()) {
        mostrar("telaSemPermissao");
        return;
      }
      await carregarTudo();
      mostrar("telaPainel");
    } catch (err) {
      console.error(err);
      mostrar("telaSemPermissao");
      avisar(mensagemErro(err), "erro");
    }
  });
}

// ---------------------------------------------------------------- dados

const porOrdem = (a, b) =>
  (Number(a.ordem) || 0) - (Number(b.ordem) || 0)
  || String(a.titulo).localeCompare(String(b.titulo), "pt-BR");

async function carregarTudo() {
  const [snapClientes, snapLinks] = await Promise.all([
    getDocs(collection(db, "clientes")),
    getDocs(collection(db, "links"))
  ]);
  clientes = snapClientes.docs.map((d) => ({ id: d.id, ...d.data() })).sort(compararNome);
  links = snapLinks.docs.map((d) => ({ id: d.id, ...d.data() })).sort(porOrdem);
  renderClientes();
  renderLinks();
}

// Id legivel a partir do nome (ex.: "aguas-de-lindoia"). Confere tambem no
// servidor, para dois admins cadastrando ao mesmo tempo nao se sobrescreverem.
async function novoId(colecao, base, lista) {
  const raiz = slug(base) || "item";
  const usados = new Set(lista.map((item) => item.id));
  for (let n = 1; ; n++) {
    const id = n === 1 ? raiz : `${raiz}-${n}`;
    if (usados.has(id)) continue;
    if (!(await getDoc(doc(db, colecao, id))).exists()) return id;
  }
}

async function salvar({ colecao, lista, editando, dados, base, form, dialogo, erro, renderizar, ordenar }) {
  const botao = form.querySelector("[type=submit]");
  botao.disabled = true;
  try {
    const id = editando ? editando.id : await novoId(colecao, base, lista);
    await setDoc(doc(db, colecao, id), dados);

    const item = { id, ...dados };
    const i = lista.findIndex((x) => x.id === id);
    if (i >= 0) lista[i] = item; else lista.push(item);
    lista.sort(ordenar);

    renderizar();
    dialogo.close();
    avisar(editando ? "Alterações salvas." : "Cadastro criado.");
  } catch (err) {
    console.error(err);
    erro(mensagemErro(err));
  } finally {
    botao.disabled = false;
  }
}

async function excluir(colecao, lista, id, nome, renderizar) {
  if (!confirm(`Excluir "${nome}"?\n\nEssa ação não pode ser desfeita.`)) return;
  try {
    await deleteDoc(doc(db, colecao, id));
    lista.splice(lista.findIndex((x) => x.id === id), 1);
    renderizar();
    avisar(`"${nome}" excluído.`);
  } catch (err) {
    console.error(err);
    avisar(mensagemErro(err), "erro");
  }
}

// Migracao unica: copia os dados que estavam fixos no HTML (data/*.json)
// para o Firestore. So aparece enquanto a colecao estiver vazia.
async function importar(colecao, arquivo) {
  try {
    const resposta = await fetch(arquivo, { cache: "no-cache" });
    if (!resposta.ok) throw new Error(`Não foi possível ler ${arquivo}`);
    const itens = await resposta.json();

    if (!confirm(`Importar ${itens.length} registros para "${colecao}"?`)) return;

    const batch = writeBatch(db);
    itens.forEach(({ id, ...dados }) => batch.set(doc(db, colecao, id), dados));
    await batch.commit();

    await carregarTudo();
    avisar(`${itens.length} registros importados.`);
  } catch (err) {
    console.error(err);
    avisar(mensagemErro(err), "erro");
  }
}

function fecharDialogos() {
  document.querySelectorAll("[data-fechar]").forEach((botao) => {
    botao.addEventListener("click", () => botao.closest("dialog").close());
  });
}

// ---------------------------------------------------------------- abas

document.querySelectorAll("[data-aba]").forEach((aba) => {
  aba.addEventListener("click", () => {
    document.querySelectorAll("[data-aba]").forEach((outra) => {
      const ativa = outra === aba;
      outra.classList.toggle("ativa", ativa);
      outra.setAttribute("aria-selected", ativa);
      $(outra.dataset.aba).hidden = !ativa;
    });
  });
});

fecharDialogos();

// ---------------------------------------------------------------- clientes

function renderClientes() {
  const termo = $("buscaClientes").value.trim();
  const q = normalizar(termo);
  const qd = digitos(termo);

  const lista = clientes.filter((c) => {
    if (!q) return true;
    const texto = normalizar([c.nome, c.site, c.cnpj, c.telefone, ...(c.links || []).map((l) => `${l.rotulo} ${l.url}`)].join(" "));
    return texto.includes(q) || (qd.length >= 3 && digitos(c.cnpj).includes(qd));
  });

  $("contaClientes").textContent = `${lista.length} de ${clientes.length} clientes`;
  $("btnImportarClientes").hidden = clientes.length > 0;

  if (!lista.length) {
    $("listaClientes").innerHTML = `<p class="admin-vazio">${clientes.length ? "Nenhum cliente encontrado." : "Nenhum cliente cadastrado ainda. Use “Importar clientes do site” para trazer os atuais."}</p>`;
    return;
  }

  $("listaClientes").innerHTML = lista.map((c) => {
    const meta = [c.cnpj, c.site && hostSite(c.site), c.telefone].filter(Boolean).map(escapeHtml).join(" &middot; ");
    const chips = ordenarLinks(c.links).map((l) => {
      const sistema = SISTEMAS[l.tipo];
      return `<span class="sys-link${sistema ? ` sys-${l.tipo}` : ""}">${escapeHtml(l.rotulo || (sistema && sistema.rotulo) || "Link")}</span>`;
    }).join("");

    return `
      <article class="admin-item">
        <span class="cliente-badge">${escapeHtml(iniciais(c.nome))}</span>
        <div class="admin-item-info">
          <strong>${escapeHtml(c.nome)}</strong>
          ${meta ? `<span class="admin-item-meta">${meta}</span>` : ""}
          <div class="admin-chips">${chips || '<span class="admin-item-meta">Sem links</span>'}</div>
        </div>
        <div class="admin-item-acoes">
          <button type="button" class="btn-sec" data-editar="${escapeHtml(c.id)}"><i class="fa-solid fa-pen"></i> Editar</button>
          <button type="button" class="btn-perigo" data-excluir="${escapeHtml(c.id)}" aria-label="Excluir ${escapeHtml(c.nome)}"><i class="fa-solid fa-trash"></i></button>
        </div>
      </article>`;
  }).join("");
}

$("buscaClientes").addEventListener("input", renderClientes);
$("btnNovoCliente").addEventListener("click", () => abrirCliente());
$("btnImportarClientes").addEventListener("click", () => importar("clientes", "data/clientes.json"));

$("listaClientes").addEventListener("click", (ev) => {
  const editar = ev.target.closest("[data-editar]");
  if (editar) abrirCliente(clientes.find((c) => c.id === editar.dataset.editar));

  const botaoExcluir = ev.target.closest("[data-excluir]");
  if (botaoExcluir) {
    const cliente = clientes.find((c) => c.id === botaoExcluir.dataset.excluir);
    if (cliente) excluir("clientes", clientes, cliente.id, cliente.nome, renderClientes);
  }
});

let clienteEditando = null;

function abrirCliente(cliente = null) {
  clienteEditando = cliente;
  $("dlgClienteTitulo").textContent = cliente ? "Editar cliente" : "Novo cliente";
  $("cliNome").value = cliente ? cliente.nome : "";
  $("cliSite").value = cliente ? cliente.site || "" : "";
  $("cliCnpj").value = cliente ? cliente.cnpj || "" : "";
  $("cliTelefone").value = cliente ? cliente.telefone || "" : "";
  $("erroCliente").hidden = true;

  $("linhasLinks").innerHTML = "";
  if (cliente) ordenarLinks(cliente.links).forEach(adicionarLinha);
  else adicionarLinha();

  $("dlgCliente").showModal();
  $("cliNome").focus();
}

function adicionarLinha(link = {}) {
  const tipo = SISTEMAS[link.tipo] ? link.tipo : "flow";
  const linha = document.createElement("div");
  linha.className = "link-linha";
  linha.innerHTML = `
    <select class="ll-tipo" aria-label="Sistema">
      ${Object.entries(SISTEMAS).map(([valor, s]) => `<option value="${valor}">${escapeHtml(s.rotulo)}</option>`).join("")}
    </select>
    <input class="ll-rotulo" type="text" aria-label="Nome do botão" placeholder="Nome do botão">
    <input class="ll-url" type="url" aria-label="Endereço do sistema" placeholder="https://...">
    <button type="button" class="btn-icone" data-remover aria-label="Remover link"><i class="fa-solid fa-xmark"></i></button>
  `;
  linha.querySelector(".ll-tipo").value = tipo;
  linha.querySelector(".ll-rotulo").value = link.rotulo || SISTEMAS[tipo].rotulo;
  linha.querySelector(".ll-url").value = link.url || "";
  linha.dataset.tipoAnterior = tipo;
  if (link.icone) linha.dataset.icone = link.icone;

  $("linhasLinks").appendChild(linha);
  return linha;
}

$("btnAddLink").addEventListener("click", () => {
  adicionarLinha().querySelector(".ll-url").focus();
});

$("linhasLinks").addEventListener("click", (ev) => {
  const remover = ev.target.closest("[data-remover]");
  if (remover) remover.closest(".link-linha").remove();
});

// Trocou o sistema: acompanha o nome do botao, a nao ser que ele tenha
// sido personalizado (ex.: "Transparência CM").
$("linhasLinks").addEventListener("change", (ev) => {
  const select = ev.target.closest(".ll-tipo");
  if (!select) return;
  const linha = select.closest(".link-linha");
  const rotulo = linha.querySelector(".ll-rotulo");
  const anterior = SISTEMAS[linha.dataset.tipoAnterior];
  if (!rotulo.value.trim() || (anterior && rotulo.value === anterior.rotulo)) {
    rotulo.value = SISTEMAS[select.value].rotulo;
  }
  delete linha.dataset.icone;
  linha.dataset.tipoAnterior = select.value;
});

$("formCliente").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const erro = (mensagem) => {
    $("erroCliente").textContent = mensagem;
    $("erroCliente").hidden = false;
  };
  $("erroCliente").hidden = true;

  const nome = $("cliNome").value.trim();
  const site = $("cliSite").value.trim();
  const cnpj = digitos($("cliCnpj").value);

  if (!nome) { $("cliNome").focus(); return erro("Informe o nome do cliente."); }
  if (site && !urlSegura(site)) { $("cliSite").focus(); return erro("O site precisa começar com http:// ou https://"); }
  if (cnpj && cnpj.length !== 14) { $("cliCnpj").focus(); return erro("O CNPJ precisa ter 14 dígitos."); }

  const novosLinks = [];
  for (const linha of $("linhasLinks").querySelectorAll(".link-linha")) {
    const tipo = linha.querySelector(".ll-tipo").value;
    const campoUrl = linha.querySelector(".ll-url");
    const url = campoUrl.value.trim();
    const rotulo = linha.querySelector(".ll-rotulo").value.trim() || SISTEMAS[tipo].rotulo;
    if (!url) continue;
    if (!urlSegura(url)) { campoUrl.focus(); return erro(`O link "${rotulo}" precisa começar com http:// ou https://`); }

    const link = { tipo, rotulo, url };
    if (linha.dataset.icone) link.icone = linha.dataset.icone;
    novosLinks.push(link);
  }

  const duplicado = cnpj && clientes.find((c) => c !== clienteEditando && digitos(c.cnpj) === cnpj);
  if (duplicado && !confirm(`Esse CNPJ já está cadastrado em "${duplicado.nome}". Salvar mesmo assim?`)) return;

  await salvar({
    colecao: "clientes",
    lista: clientes,
    editando: clienteEditando,
    dados: {
      nome,
      site,
      cnpj: formatarCnpj($("cliCnpj").value),
      telefone: formatarTelefone($("cliTelefone").value),
      links: novosLinks
    },
    base: nome,
    form: ev.currentTarget,
    dialogo: $("dlgCliente"),
    erro,
    renderizar: renderClientes,
    ordenar: compararNome
  });
});

// ---------------------------------------------------------------- links rapidos

Object.entries(CATEGORIAS_LINK).forEach(([valor, categoria]) => {
  if (valor === "all") return;
  $("lnkCategoria").add(new Option(categoria.label, valor));
});
Object.entries(CORES_LINK).forEach(([valor, nome]) => {
  $("lnkCor").add(new Option(nome, valor));
});

function renderLinks() {
  $("contaLinks").textContent = `${links.length} ${links.length === 1 ? "link" : "links"}`;
  $("btnImportarLinks").hidden = links.length > 0;

  if (!links.length) {
    $("listaLinks").innerHTML = '<p class="admin-vazio">Nenhum link cadastrado ainda. Use “Importar links do site” para trazer os atuais.</p>';
    return;
  }

  $("listaLinks").innerHTML = links.map((l) => {
    const categoria = CATEGORIAS_LINK[l.categoria];
    return `
      <article class="admin-item">
        <span class="link-icon ${escapeHtml(CORES_LINK[l.cor] ? l.cor : "orange")}"><i class="${escapeHtml(classeIcone(l.icone))}"></i></span>
        <div class="admin-item-info">
          <strong>${escapeHtml(l.titulo)}</strong>
          <span class="admin-item-meta">${escapeHtml(categoria ? categoria.label : l.categoria)} &middot; ${escapeHtml(l.url)}</span>
        </div>
        <div class="admin-item-acoes">
          <button type="button" class="btn-sec" data-editar="${escapeHtml(l.id)}"><i class="fa-solid fa-pen"></i> Editar</button>
          <button type="button" class="btn-perigo" data-excluir="${escapeHtml(l.id)}" aria-label="Excluir ${escapeHtml(l.titulo)}"><i class="fa-solid fa-trash"></i></button>
        </div>
      </article>`;
  }).join("");
}

$("btnNovoLink").addEventListener("click", () => abrirLink());
$("btnImportarLinks").addEventListener("click", () => importar("links", "data/links.json"));

$("listaLinks").addEventListener("click", (ev) => {
  const editar = ev.target.closest("[data-editar]");
  if (editar) abrirLink(links.find((l) => l.id === editar.dataset.editar));

  const botaoExcluir = ev.target.closest("[data-excluir]");
  if (botaoExcluir) {
    const link = links.find((l) => l.id === botaoExcluir.dataset.excluir);
    if (link) excluir("links", links, link.id, link.titulo, renderLinks);
  }
});

let linkEditando = null;

function atualizarPreviewIcone() {
  const cor = $("lnkCor").value;
  $("lnkPreview").className = `link-icon ${cor}`;
  $("lnkPreview").innerHTML = `<i class="${escapeHtml(classeIcone($("lnkIcone").value.trim()))}"></i>`;
}

$("lnkIcone").addEventListener("input", atualizarPreviewIcone);
$("lnkCor").addEventListener("change", atualizarPreviewIcone);

function abrirLink(link = null) {
  linkEditando = link;
  const maiorOrdem = links.reduce((max, l) => Math.max(max, Number(l.ordem) || 0), 0);

  $("dlgLinkTitulo").textContent = link ? "Editar link" : "Novo link";
  $("lnkTitulo").value = link ? link.titulo : "";
  $("lnkDescricao").value = link ? link.descricao || "" : "";
  $("lnkUrl").value = link ? link.url : "";
  $("lnkCategoria").value = link && CATEGORIAS_LINK[link.categoria] ? link.categoria : "sistemas";
  $("lnkTag").value = link ? link.tag || "" : "";
  $("lnkIcone").value = link ? link.icone || "" : "";
  $("lnkCor").value = link && CORES_LINK[link.cor] ? link.cor : "orange";
  $("lnkOrdem").value = link ? Number(link.ordem) || 0 : maiorOrdem + 10;
  $("erroLink").hidden = true;
  atualizarPreviewIcone();

  $("dlgLink").showModal();
  $("lnkTitulo").focus();
}

$("formLink").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const erro = (mensagem) => {
    $("erroLink").textContent = mensagem;
    $("erroLink").hidden = false;
  };
  $("erroLink").hidden = true;

  const titulo = $("lnkTitulo").value.trim();
  const url = $("lnkUrl").value.trim();

  if (!titulo) { $("lnkTitulo").focus(); return erro("Informe o título."); }
  if (!url) { $("lnkUrl").focus(); return erro("Informe o endereço."); }
  if (!urlSegura(url, { relativa: true })) {
    $("lnkUrl").focus();
    return erro("O endereço precisa começar com http:// ou https:// (ou ser um caminho do site, como downloads/arquivo.zip).");
  }

  await salvar({
    colecao: "links",
    lista: links,
    editando: linkEditando,
    dados: {
      titulo,
      descricao: $("lnkDescricao").value.trim(),
      url,
      categoria: $("lnkCategoria").value,
      tag: $("lnkTag").value.trim(),
      icone: $("lnkIcone").value.trim() || "fa-link",
      cor: $("lnkCor").value,
      ordem: Number($("lnkOrdem").value) || 0
    },
    base: titulo,
    form: ev.currentTarget,
    dialogo: $("dlgLink"),
    erro,
    renderizar: renderLinks,
    ordenar: porOrdem
  });
});
