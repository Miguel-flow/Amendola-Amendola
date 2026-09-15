(function () {
  'use strict';

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('sr-visible');
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
})();
