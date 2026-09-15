// Regras compartilhadas entre as paginas publicas (clientes, links) e o
// painel admin. Mudou um sistema, categoria ou cor? Mude so aqui.

export const SISTEMAS = {
  flow:       { rotulo: "FlowDocs",      icone: "fa-file-signature" },
  integrador: { rotulo: "Integrador",    icone: "fa-plug" },
  scpi:       { rotulo: "SCPI 9",        icone: "fa-chart-line" },
  transp:     { rotulo: "Transparência", icone: "fa-magnifying-glass-chart" },
  portal:     { rotulo: "Serviços",      icone: "fa-headset" },
  iss:        { rotulo: "ISS",           icone: "fa-file-invoice-dollar" },
  sip:        { rotulo: "Holerite",      icone: "fa-money-check-dollar" },
  sia:        { rotulo: "SIAWeb",        icone: "fa-database" },
  trib:       { rotulo: "Tributos",      icone: "fa-landmark" }
};

export const CATEGORIAS_LINK = {
  all:        { label: "Todos",      icon: "fa-border-all" },
  sistemas:   { label: "Sistemas",   icon: "fa-display" },
  documentos: { label: "Documentos", icon: "fa-folder-open" },
  interno:    { label: "Interno",    icon: "fa-building-user" },
  suporte:    { label: "Suporte",    icon: "fa-headset" }
};

export const CORES_LINK = {
  orange: "Laranja",
  teal:   "Verde-água",
  blue:   "Azul",
  slate:  "Grafite",
  green:  "Verde",
  red:    "Vermelho"
};

export function normalizar(texto) {
  return String(texto ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function slug(texto) {
  return normalizar(texto).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function digitos(texto) {
  return String(texto ?? "").replace(/\D/g, "");
}

export function escapeHtml(texto) {
  return String(texto ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

// So deixa passar http(s) (e, se permitido, caminho relativo do proprio site).
// Barra esquemas como javascript: vindos do banco.
export function urlSegura(url, { relativa = false } = {}) {
  const valor = String(url ?? "").trim();
  if (!valor) return "";
  if (/^https?:\/\/[^\s]+$/i.test(valor)) return valor;
  if (relativa && !/^[a-z][a-z0-9+.-]*:/i.test(valor) && !valor.startsWith("//")) return valor;
  return "";
}

export function hostSite(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return String(url ?? ""); }
}

// "Aguas de Lindóia - SAAE" -> AL, "Arealva" -> AR
export function iniciais(nome) {
  const palavras = String(nome ?? "").split(" - ")[0].split(/\s+/)
    .filter((p) => p && !/^(de|da|do|dos|das|e)$/i.test(p));
  const letras = palavras.length > 1 ? palavras[0][0] + palavras[1][0] : (palavras[0] || "").slice(0, 2);
  return normalizar(letras).toUpperCase();
}

export function classeIcone(icone) {
  const valor = String(icone || "fa-link");
  return /\bfa-(brands|regular|solid)\b/.test(valor) ? valor : `fa-solid ${valor}`;
}

const ORDEM_SISTEMAS = Object.keys(SISTEMAS);

export function ordenarLinks(links) {
  const posicao = (tipo) => {
    const i = ORDEM_SISTEMAS.indexOf(tipo);
    return i === -1 ? ORDEM_SISTEMAS.length : i;
  };
  return [...(links || [])].sort((a, b) => posicao(a.tipo) - posicao(b.tipo));
}

export function compararNome(a, b) {
  return String(a.nome).localeCompare(String(b.nome), "pt-BR", { sensitivity: "base" });
}

export function formatarCnpj(valor) {
  const d = digitos(valor);
  return d.length === 14
    ? d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
    : String(valor ?? "").trim();
}

export function formatarTelefone(valor) {
  const d = digitos(valor);
  if (d.length === 10) return d.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  if (d.length === 11) return d.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  return String(valor ?? "").trim();
}
