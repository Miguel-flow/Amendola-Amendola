(function () {
  'use strict';

  function mostrar(el) {
    el.classList.add('sr-visible');
  }

  // Sem IntersectionObserver nada seria revelado: deixa tudo visivel
  // (o CSS so esconde [data-sr] quando <html> tem a classe sr-on).
  if (!('IntersectionObserver' in window)) {
    window.srObserve = function () {};
    return;
  }

  document.documentElement.classList.add('sr-on');

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        mostrar(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px'
  });

  function init(root) {
    (root || document).querySelectorAll('[data-sr]').forEach(function (el) {
      observer.observe(el);
    });
  }

  // Conteudo inserido depois do carregamento (ex.: cards vindos do Firebase)
  // precisa chamar window.srObserve(container), senao fica invisivel.
  window.srObserve = init;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(); });
  } else {
    init();
  }

  // Rede de seguranca: se o observer nao disparar (aba em segundo plano,
  // navegador com bug), o que ja esta na tela nao pode ficar invisivel.
  window.addEventListener('load', function () {
    setTimeout(function () {
      document.querySelectorAll('[data-sr]:not(.sr-visible)').forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          mostrar(el);
          observer.unobserve(el);
        }
      });
    }, 1200);
  });
})();
