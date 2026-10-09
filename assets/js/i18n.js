// Traducao do site no navegador.
//
// O HTML continua escrito em portugues do Brasil. Para os outros idiomas existe
// um dicionario em assets/i18n/<idioma>.json no formato
//   { "texto original em pt-BR": "texto traduzido" }
// e este script troca os textos da pagina pelos do dicionario. Texto que nao
// estiver no dicionario simplesmente continua em portugues.
//
// Quando o texto tem formatacao no meio (<strong>, <a>, <br>...), a chave usa
// marcadores numerados no lugar das tags:
//   "Desenvolvido por <0>FlowDocs</0>"
// A traducao repete os mesmos marcadores, na ordem que fizer sentido no idioma.
//
// Para descobrir o que falta traduzir numa pagina, abra o console do navegador
// (F12) com o idioma desejado selecionado e rode:  i18n.faltando()
//
// Para manter um trecho sempre em portugues, use o atributo data-no-i18n.
(function () {
  const IDIOMAS = {
    "pt-BR": "Português (Brasil)",
    "pt-PT": "Português (Portugal)",
    en: "English",
    es: "Español",
    ja: "日本語"
  };
  const PADRAO = "pt-BR";
  const CHAVE = "idioma";
  const ATRIBUTOS = ["placeholder", "aria-label", "title", "alt"];
  const IGNORAR = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "IFRAME", "TEXTAREA", "svg"]);
  const INLINE = new Set(["A", "B", "STRONG", "EM", "I", "SPAN", "BR", "SMALL", "U", "SUP", "SUB", "MARK", "ABBR"]);

  const raizHtml = document.documentElement;
  let dicionario = null;
  let coleta = null;

  function lerIdioma() {
    try {
      const salvo = localStorage.getItem(CHAVE);
      return IDIOMAS[salvo] ? salvo : PADRAO;
    } catch (err) {
      return PADRAO;
    }
  }

  const idioma = lerIdioma();

  const normalizar = (texto) => texto.replace(/\s+/g, " ").trim();
  const temLetra = (texto) => /\p{L}/u.test(texto);

  // Devolve a traducao da chave (ou undefined). No modo coleta, so anota as
  // chaves que ainda nao tem traducao.
  function buscar(chave) {
    if (!chave || !temLetra(chave)) return undefined;
    const traducao = dicionario ? dicionario[chave] : undefined;
    if (coleta && !traducao) coleta.add(chave);
    return traducao && traducao !== chave ? traducao : undefined;
  }

  // "Rico" = elemento com texto proprio misturado com tags de formatacao que
  // tambem tem texto. Esses sao traduzidos inteiros, para a ordem das palavras
  // poder mudar de um idioma para outro.
  function ehRico(el) {
    let textoProprio = false;
    let filhoComTexto = false;

    for (const no of el.childNodes) {
      if (no.nodeType === 3) {
        if (no.nodeValue.trim()) textoProprio = true;
      } else if (no.nodeType === 1) {
        if (no.tagName === "BR" || no.textContent.trim()) filhoComTexto = true;
      }
    }

    if (!textoProprio || !filhoComTexto) return false;
    for (const descendente of el.querySelectorAll("*")) {
      if (!INLINE.has(descendente.tagName)) return false;
    }
    return true;
  }

  function serializar(el, filhos) {
    let saida = "";
    for (const no of el.childNodes) {
      if (no.nodeType === 3) {
        saida += no.nodeValue;
      } else if (no.nodeType === 1) {
        const indice = filhos.push(no) - 1;
        saida += no.childNodes.length
          ? `<${indice}>${serializar(no, filhos)}</${indice}>`
          : `<${indice}/>`;
      }
    }
    return saida;
  }

  // Remonta o elemento a partir da traducao, reaproveitando as tags originais
  // (assim links, classes e eventos continuam os mesmos).
  function montar(el, modelo, filhos) {
    const fragmento = document.createDocumentFragment();
    const pilha = [fragmento];

    for (const parte of modelo.matchAll(/<(\d+)\/>|<(\d+)>|<\/\d+>|[^<]+|</g)) {
      const topo = pilha[pilha.length - 1];

      if (parte[1] !== undefined) {
        if (filhos[parte[1]]) topo.append(filhos[parte[1]]);
      } else if (parte[2] !== undefined) {
        const filho = filhos[parte[2]];
        if (filho) {
          filho.textContent = "";
          topo.append(filho);
        }
        pilha.push(filho || topo);
      } else if (parte[0].startsWith("</")) {
        if (pilha.length > 1) pilha.pop();
      } else {
        topo.append(parte[0]);
      }
    }

    el.replaceChildren(fragmento);
  }

  function traduzirTexto(no) {
    const bruto = no.nodeValue;
    const traducao = buscar(normalizar(bruto));
    if (!traducao || coleta) return;
    no.nodeValue = bruto.match(/^\s*/)[0] + traducao + bruto.match(/\s*$/)[0];
  }

  function traduzirElemento(el) {
    if (IGNORAR.has(el.tagName) || el.hasAttribute("data-no-i18n")) return;

    for (const atributo of ATRIBUTOS) {
      const valor = el.getAttribute(atributo);
      if (!valor) continue;
      const traducao = buscar(normalizar(valor));
      if (traducao && !coleta) el.setAttribute(atributo, traducao);
    }

    if (ehRico(el)) {
      const filhos = [];
      const traducao = buscar(normalizar(serializar(el, filhos)));
      if (coleta) return;
      if (traducao) {
        montar(el, traducao, filhos);
        return;
      }
    }

    for (const no of Array.from(el.childNodes)) {
      if (no.nodeType === 3) traduzirTexto(no);
      else if (no.nodeType === 1) traduzirElemento(no);
    }
  }

  function traduzir(no) {
    if (no.nodeType === 3) {
      if (!no.parentElement || !no.parentElement.closest("[data-no-i18n]")) traduzirTexto(no);
    } else if (no.nodeType === 1 && !no.closest("[data-no-i18n]")) {
      traduzirElemento(no);
    }
  }

  function traduzirPagina() {
    const titulo = buscar(normalizar(document.title));
    if (titulo && !coleta) document.title = titulo;
    traduzir(document.body);
  }

  // ---------------------------------------------------------------- seletor

  function sincronizarSeletor() {
    const atual = document.getElementById("langAtual");
    if (!atual || atual.dataset.pronto) return;

    atual.dataset.pronto = "1";
    atual.textContent = IDIOMAS[idioma];
    document.querySelectorAll("#langMenu [data-lang]").forEach((opcao) => {
      opcao.setAttribute("aria-selected", opcao.dataset.lang === idioma ? "true" : "false");
    });
  }

  // Abrir/fechar o menu e feito pelo initFooter() do loader.js; aqui so
  // tratamos a escolha do idioma e mantemos o aria-expanded em dia.
  document.addEventListener("click", (evento) => {
    const opcao = evento.target.closest("#langMenu [data-lang]");

    if (opcao && IDIOMAS[opcao.dataset.lang]) {
      if (opcao.dataset.lang === idioma) return;
      try {
        localStorage.setItem(CHAVE, opcao.dataset.lang);
      } catch (err) {
        return;
      }
      window.location.reload();
      return;
    }

    setTimeout(() => {
      const botao = document.getElementById("langButton");
      const menu = document.getElementById("langMenu");
      if (botao && menu) botao.setAttribute("aria-expanded", menu.classList.contains("active"));
    }, 0);
  });

  // ------------------------------------------------------------ inicializacao

  // Navbar, footer e listas chegam depois via JavaScript: o observador traduz
  // o que for sendo inserido na pagina.
  const observador = new MutationObserver((mutacoes) => {
    sincronizarSeletor();

    if (dicionario) {
      for (const mutacao of mutacoes) {
        if (mutacao.type === "characterData") traduzir(mutacao.target);
        else mutacao.addedNodes.forEach(traduzir);
      }
      // Descarta as mutacoes causadas pela propria traducao.
      observador.takeRecords();
    }
  });

  function iniciar() {
    sincronizarSeletor();
    observador.observe(document.body, { childList: true, subtree: true, characterData: true });
    if (dicionario) traduzirPagina();
  }

  raizHtml.lang = idioma;

  if (idioma === PADRAO) {
    iniciar();
  } else {
    // Esconde a pagina ate a traducao chegar, para o texto nao "piscar" em
    // portugues. O limite de tempo garante que o site aparece mesmo se o
    // dicionario falhar.
    raizHtml.classList.add("i18n-carregando");
    const mostrar = () => raizHtml.classList.remove("i18n-carregando");
    const limite = setTimeout(mostrar, 2000);

    fetch(`assets/i18n/${idioma}.json`, { cache: "no-cache" })
      .then((resposta) => {
        if (!resposta.ok) throw new Error(`Erro ao carregar o idioma ${idioma}`);
        return resposta.json();
      })
      .then((dados) => {
        dicionario = dados;
      })
      .catch((err) => console.error(err))
      .finally(() => {
        iniciar();
        clearTimeout(limite);
        mostrar();
      });
  }

  window.i18n = {
    idioma,
    idiomas: IDIOMAS,
    // Lista os textos da pagina (ou de outro documento) sem traducao no
    // idioma atual.
    faltando(raiz = document.body) {
      coleta = new Set();
      try {
        if (raiz === document.body) traduzirPagina();
        else traduzirElemento(raiz);
        // O que ja foi traduzido aparece na pagina no outro idioma: nao conta.
        const traduzidos = new Set(Object.values(dicionario || {}));
        return Array.from(coleta).filter((texto) => !traduzidos.has(texto));
      } finally {
        coleta = null;
      }
    }
  };
})();
