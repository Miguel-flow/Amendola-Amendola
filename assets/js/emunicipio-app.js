(function () {
  'use strict';

  // Telas dos módulos, copiadas das capturas do app nas lojas (Google Play e App Store).
  // Os serviços não abrem telas: mostram um aviso de que estão disponíveis no app.
  var MODULOS = {
    faleconosco: {
      nome: 'Fale conosco',
      desc: 'Seus protocolos, mensagens e solicitações.',
      cor: 'orange',
      icone: 'headset',
      secoes: [
        { destaque: true, icone: 'file-plus', titulo: 'Nova solicitação', desc: 'Abra um novo protocolo ou solicitação.' },
        { h4: 'Suas pastas' },
        { icone: 'inbox', titulo: 'Caixa de Entrada', desc: 'Mensagens e protocolos recebidos', badge: 1 },
        { icone: 'send', titulo: 'Itens Enviados', desc: 'Solicitações que você enviou' },
        { icone: 'archive', titulo: 'Arquivados', desc: 'Protocolos encerrados ou guardados' }
      ]
    },
    ensino: {
      nome: 'Ensino',
      desc: 'Acompanhe a vida escolar e os serviços da educação.',
      cor: 'indigo',
      icone: 'school',
      secoes: [
        { h4: 'Serviços disponíveis' },
        { icone: 'checklist', titulo: 'Boletim', desc: 'Notas, faltas e ocorrências do aluno' },
        { icone: 'bus', titulo: 'Chamada Ônibus', desc: 'Registre a presença no transporte escolar' },
        { icone: 'book-filled', titulo: 'Diário de Classe', desc: 'Frequência e conteúdo das turmas' },
        { icone: 'bell', titulo: 'Notificações', desc: 'Avisos e comunicados da escola' },
        { h5: 'Creche' },
        { icone: 'user-check', titulo: 'Inscrever na lista de espera', desc: 'Inscreva-se na lista de espera da creche' },
        { icone: 'list-details', titulo: 'Consultar lista de espera', desc: 'Acompanhe sua inscrição na creche' },
        { h5: 'Pré-matrícula' },
        { icone: 'user-check', titulo: 'Inscrever na lista de espera', desc: 'Inscreva-se na lista de espera da escola' },
        { icone: 'list-details', titulo: 'Consultar lista de espera', desc: 'Acompanhe sua inscrição na escola' }
      ]
    },
    saude: {
      nome: 'Saúde',
      desc: 'Agende, consulte e acompanhe seus atendimentos.',
      cor: 'pink',
      icone: 'heart',
      secoes: [
        { h4: 'Serviços disponíveis' },
        { icone: 'flask', titulo: 'Resultado de exames', desc: 'Consulte os laudos dos seus exames' },
        { icone: 'medicine-syrup', titulo: 'Consulta de medicamentos', desc: 'Veja a disponibilidade nas unidades' },
        { icone: 'vaccine', titulo: 'Carteira nacional de vacinação', desc: 'Acompanhe suas vacinas e doses' },
        { icone: 'report-medical', titulo: 'Prontuário', desc: 'Atendimentos, medicamentos retirados e anexos' },
        { h5: 'Agendamento de consultas' },
        { icone: 'calendar-check', titulo: 'Agendar consulta', desc: 'Marque uma consulta na rede' },
        { icone: 'calendar-month', titulo: 'Agendamentos', desc: 'Acompanhe suas consultas marcadas' },
        { h5: 'Agendamento de transportes' },
        { icone: 'ambulance', titulo: 'Agendar transporte', desc: 'Solicite transporte para tratamento' },
        { icone: 'calendar-event', titulo: 'Agendamentos', desc: 'Acompanhe seus transportes marcados' }
      ]
    },
    folha: {
      nome: 'Folha de pagamento',
      desc: 'Holerite, ponto, férias e solicitações do servidor.',
      cor: 'violet',
      icone: 'cash',
      secoes: [
        { h4: 'Serviços disponíveis' },
        { h5: 'Pagamentos' },
        { icone: 'receipt', titulo: 'Consulta de holerite', desc: 'Veja seus contracheques por competência' },
        { icone: 'file-description', titulo: 'Informe de rendimentos', desc: 'Baixe o informe para o imposto de renda' },
        { icone: 'wallet', titulo: 'Consulta de margem consignável', desc: 'Acompanhe sua margem para empréstimos' },
        { icone: 'shield-check', titulo: 'Validar empréstimo', desc: 'Valide um empréstimo consignado' },
        { h5: 'Ponto e frequência' },
        { icone: 'alarm', titulo: 'Marcar ponto', desc: 'Registre sua entrada e saída' },
        { icone: 'clock', titulo: 'Consulta de ponto', desc: 'Baixe ou assine o espelho de ponto' },
        { icone: 'calendar-event', titulo: 'Comprovante de ponto', desc: 'Veja o comprovante de registro de ponto' },
        { icone: 'calendar-cog', titulo: 'Manutenção de ponto', desc: 'Solicite ajustes nos registros' }
      ]
    },
    portal: {
      nome: 'Portal de serviços',
      desc: 'Acesse serviços e informações de forma rápida e segura.',
      cor: 'forest',
      icone: 'building-bank',
      secoes: [
        { h4: 'Serviços disponíveis' },
        { icone: 'world', titulo: 'Portal de serviços', desc: 'Acesse o portal completo de serviços da prefeitura', externo: true },
        { icone: 'shield-check', titulo: 'Autenticidade do ITBI', desc: 'Verifique a autenticidade do documento ITBI' },
        { icone: 'file-dollar', titulo: 'Consulta de débitos', desc: 'Consulte débitos municipais em aberto' },
        { icone: 'receipt-2', titulo: 'Segunda via de carnê', desc: 'Emita a segunda via do seu carnê' },
        { icone: 'id', titulo: 'Autenticidade de documentos', desc: 'Verifique a autenticidade de documentos emitidos' },
        { icone: 'rosette', titulo: 'Certidão de regularidade fiscal', desc: 'Emita sua certidão de regularidade fiscal' },
        { icone: 'folder', titulo: 'Documentos', desc: 'Emita documentos do seu cadastro' }
      ]
    },
    contabilidade: {
      nome: 'Contabilidade',
      desc: 'EMPRESA DE DEMONSTRAÇÃO LTDA',
      cor: 'cyan',
      icone: 'file-invoice',
      secoes: [
        { h4: 'Serviços disponíveis' },
        { icone: 'file-text', titulo: 'Contratos', desc: 'Contratos da empresa' },
        { icone: 'file-dollar', titulo: 'Pedidos', desc: 'Pedidos de compra' },
        { icone: 'wallet', titulo: 'Empenhos', desc: 'Empenhos, liquidações e pagamentos' },
        { icone: 'id', titulo: 'Funcionários autorizados', desc: 'Funcionários autorizados da empresa' }
      ]
    },
    assinador:      { nome: 'Assinador',      desc: 'Assine documentos digitais', cor: 'teal', icone: 'writing-sign' },
    abastecimentos: { nome: 'Abastecimentos', desc: 'Frota e combustível',        cor: 'red',  icone: 'gas-station' }
  };

  // Dados fictícios usados só na demonstração da página.
  var avisos = [
    { titulo: 'Sua solicitação foi respondida', texto: 'Protocolo 2026/003977 – Buraco na via', quando: 'Hoje, 08:12', cor: 'orange', icone: 'headset', lido: false, abre: 'faleconosco' },
    { titulo: 'Boletim do 3º bimestre', texto: 'As notas já estão disponíveis.', quando: 'Ontem', cor: 'indigo', icone: 'school', lido: false, abre: 'ensino' },
    { titulo: 'Holerite de setembro', texto: 'Seu contracheque está disponível.', quando: '20/09', cor: 'violet', icone: 'cash', lido: false, abre: 'folha' },
    { titulo: 'Campanha de vacinação', texto: 'Vacina contra a gripe nas unidades de saúde até 30/09.', quando: '15/09', cor: 'pink', icone: 'heart', lido: true, abre: 'saude' },
    { titulo: 'IPTU 2026', texto: 'A última parcela vence em 30/09.', quando: '10/09', cor: 'green', icone: 'building-bank', lido: true, abre: 'portal' }
  ];

  function icone(nome) {
    return '<svg class="ti"><use href="#ti-' + nome + '"/></svg>';
  }

  function corModulo(el, cor) {
    el.style.setProperty('--mod', 'var(--oc-' + cor + ')');
    el.style.setProperty('--mod-soft', 'var(--oc-' + cor + '-soft)');
  }

  function init() {
    var app = document.querySelector('[data-emapp]');
    if (!app) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var stack = ['home'];
    var toastTimer = null;

    function $(sel, root) { return (root || app).querySelector(sel); }
    function $$(sel, root) { return Array.prototype.slice.call((root || app).querySelectorAll(sel)); }
    function view(nome) { return $('.app-view[data-view="' + nome + '"]'); }

    function esc(texto) {
      var div = document.createElement('div');
      div.textContent = texto;
      return div.innerHTML;
    }

    function atualizarRelogio() {
      var agora = new Date();
      $('.app-clock').textContent = ('0' + agora.getHours()).slice(-2) + ':' + ('0' + agora.getMinutes()).slice(-2);
    }

    // ===== NAVEGAÇÃO =====
    function semAnimacao(el, fn) {
      el.classList.add('no-anim');
      fn();
      void el.offsetWidth;
      el.classList.remove('no-anim');
    }

    function atualizarAbas() {
      // Dentro de um módulo nenhuma aba fica destacada, como no app
      var raiz = stack.length === 1 ? stack[0] : null;
      $$('.app-tabbar [data-tab]').forEach(function (b) {
        b.classList.toggle('is-active', b.getAttribute('data-tab') === raiz);
      });
    }

    function push(nome) {
      var atual = view(stack[stack.length - 1]);
      var nova = view(nome);
      if (!nova || atual === nova) return;

      atual.classList.remove('is-current');
      atual.classList.add('is-under');

      nova.scrollTop = 0;
      nova.classList.add('is-current');
      stack.push(nome);
      atualizarAbas();
    }

    function pop() {
      if (stack.length < 2) return;
      var atual = view(stack.pop());
      var anterior = view(stack[stack.length - 1]);
      atual.classList.remove('is-current');
      anterior.classList.remove('is-under');
      anterior.classList.add('is-current');
      atualizarAbas();
    }

    function irParaAba(nome, instantaneo) {
      while (stack.length > 1) {
        var v = view(stack.pop());
        semAnimacao(v, function () { v.classList.remove('is-current', 'is-under'); });
      }

      var atual = view(stack[0]);
      var nova = view(nome);
      atual.classList.remove('is-under');

      if (atual !== nova) {
        semAnimacao(atual, function () { atual.classList.remove('is-current'); });
        semAnimacao(nova, function () {
          nova.classList.add('is-current');
          nova.classList.remove('is-fading');
          if (!instantaneo && !reduceMotion) {
            void nova.offsetWidth;
            nova.classList.add('is-fading');
          }
        });
        nova.scrollTop = 0;
        stack[0] = nome;
      } else {
        nova.classList.add('is-current');
      }
      atualizarAbas();
    }

    function toast(texto) {
      var el = $('[data-toast]');
      el.textContent = texto;
      el.classList.add('is-visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { el.classList.remove('is-visible'); }, 2200);
    }

    // ===== MÓDULOS =====
    function renderModulo(id) {
      var m = MODULOS[id];
      var v = view('modulo');
      corModulo(v, m.cor);
      $('[data-mod-name]').textContent = m.nome;
      $('[data-mod-desc]').textContent = m.desc;
      $('[data-mod-icon]').innerHTML = icone(m.icone);

      var corpo = $('[data-mod-body]');
      if (!m.secoes) {
        corpo.className = 'app-modbody app-soon';
        corpo.innerHTML =
          '<span class="app-tile">' + icone(m.icone) + '</span>' +
          '<strong>Em breve nesta demonstração</strong>' +
          '<p>Baixe o e-Município na Google Play ou na App Store para usar este serviço.</p>';
        return;
      }

      corpo.className = 'app-modbody';
      corpo.innerHTML = m.secoes.map(function (s) {
        if (s.h4) return '<h4>' + esc(s.h4) + '</h4>';
        if (s.h5) return '<h5>' + esc(s.h5) + '</h5>';
        return '<button type="button" class="app-svc' + (s.destaque ? ' is-featured' : '') + '" data-soon>' +
          '<span class="app-tile">' + icone(s.icone) + '</span>' +
          '<span class="app-svc-text"><strong>' + esc(s.titulo) + '</strong><small>' + esc(s.desc) + '</small></span>' +
          (s.badge ? '<b class="app-count">' + s.badge + '</b>' : '') +
          icone(s.destaque ? 'plus' : s.externo ? 'external-link' : 'chevron-right') +
          '</button>';
      }).join('');
    }

    function abrirModulo(id) {
      if (!MODULOS[id]) return;
      renderModulo(id);
      push('modulo');
    }

    // ===== AVISOS =====
    function renderAvisos() {
      $('[data-avisos]').innerHTML = avisos.map(function (a, i) {
        return '<li><button type="button" data-aviso="' + i + '" class="' + (a.lido ? '' : 'is-unread') + '">' +
          '<span class="app-tile tone-' + a.cor + '">' + icone(a.icone) + '</span>' +
          '<div><strong>' + esc(a.titulo) + '</strong><span>' + esc(a.texto) + '</span><small>' + esc(a.quando) + '</small></div>' +
          '</button></li>';
      }).join('');
      $('[data-badge]').hidden = avisos.every(function (a) { return a.lido; });
    }

    // ===== CLIQUES =====
    app.addEventListener('click', function (e) {
      var alvo = e.target.closest('button');
      if (!alvo || !app.contains(alvo)) return;

      if (alvo.hasAttribute('data-module')) return abrirModulo(alvo.getAttribute('data-module'));
      if (alvo.hasAttribute('data-go')) return push(alvo.getAttribute('data-go'));
      if (alvo.hasAttribute('data-back')) return pop();
      if (alvo.hasAttribute('data-tab')) return irParaAba(alvo.getAttribute('data-tab'));
      if (alvo.hasAttribute('data-soon')) return toast('Disponível no app e-Município');

      if (alvo.hasAttribute('data-aviso')) {
        var aviso = avisos[+alvo.getAttribute('data-aviso')];
        aviso.lido = true;
        renderAvisos();
        return abrirModulo(aviso.abre);
      }

      switch (alvo.getAttribute('data-action')) {
        case 'ler-todos':
          avisos.forEach(function (a) { a.lido = true; });
          renderAvisos();
          toast('Todos os avisos foram marcados como lidos');
          break;
        case 'sair':
          toast('Esta é só uma demonstração 🙂');
          break;
      }
    });

    // Textos ao lado do celular abrem o módulo correspondente
    function abrirPelaPagina(item) {
      irParaAba('home', true);
      abrirModulo(item.getAttribute('data-app-open'));

      var r = app.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) {
        app.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      }
    }

    $$('[data-app-open]', document).forEach(function (item) {
      item.addEventListener('click', function () { abrirPelaPagina(item); });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          abrirPelaPagina(item);
        }
      });
    });

    atualizarRelogio();
    setInterval(atualizarRelogio, 30000);
    renderAvisos();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
