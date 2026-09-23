(function () {
  'use strict';

  function init() {
    var scene = document.querySelector('.phone-scene');
    var phone = scene && scene.querySelector('.phone-wrapper');
    if (!scene || !phone) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Entrada 3D: o celular gira para dentro quando a seção aparece na tela
    if ('IntersectionObserver' in window) {
      phone.classList.add('phone-hidden');
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          phone.classList.remove('phone-hidden');
          phone.classList.add('phone-enter');
          io.disconnect();
        });
      }, { threshold: 0.3 });
      io.observe(scene);

      phone.addEventListener('animationend', function (e) {
        if (e.animationName === 'phoneEntrance') {
          phone.classList.remove('phone-enter');
        }
      });
    }

    // No toque, o celular para de flutuar e fica reto enquanto a pessoa usa a tela
    var screen = phone.querySelector('.phone-screen');
    if (screen) {
      screen.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse') return;
        phone.classList.remove('phone-hidden', 'phone-enter');
        phone.classList.add('is-using');
      });
    }

    if (!window.matchMedia('(hover: hover)').matches) return;

    // Pose de repouso = frame 0% da animação phoneFloat, para a volta ser suave
    var REST_X = 4, REST_Y = -14;
    var targetRotX = REST_X, targetRotY = REST_Y;
    var curRotX = REST_X, curRotY = REST_Y;
    var raf = null, hovering = false;

    function loop() {
      curRotX += (targetRotX - curRotX) * 0.12;
      curRotY += (targetRotY - curRotY) * 0.12;
      phone.style.transform =
        'rotateX(' + curRotX.toFixed(2) + 'deg)' +
        ' rotateY(' + curRotY.toFixed(2) + 'deg)' +
        (hovering ? ' translateY(-10px)' : '');

      var settled = Math.abs(curRotX - targetRotX) < 0.05 && Math.abs(curRotY - targetRotY) < 0.05;
      if (hovering || !settled) {
        raf = requestAnimationFrame(loop);
      } else {
        phone.style.transform = '';
        phone.classList.remove('is-tilting');
        raf = null;
      }
    }

    scene.addEventListener('mousemove', function (e) {
      var r = scene.getBoundingClientRect();
      var relX = (e.clientX - r.left) / r.width - 0.5;
      var relY = (e.clientY - r.top) / r.height - 0.5;
      // Sobre a tela o celular quase não inclina, para os cliques ficarem precisos
      var overScreen = screen && screen.contains(e.target);
      var force = overScreen ? 0.15 : 1;
      targetRotY = relX * 24 * force;
      targetRotX = -relY * 16 * force;
      phone.classList.toggle('is-over-screen', !!overScreen);
      phone.style.setProperty('--gx', (relX * 120 + 50).toFixed(1) + '%');
      phone.style.setProperty('--gy', (relY * 120 + 50).toFixed(1) + '%');
      hovering = true;
      phone.classList.remove('phone-hidden');
      phone.classList.remove('phone-enter');
      phone.classList.add('is-tilting');
      if (!raf) raf = requestAnimationFrame(loop);
    });

    scene.addEventListener('mouseleave', function () {
      hovering = false;
      phone.classList.remove('is-over-screen');
      targetRotX = REST_X;
      targetRotY = REST_Y;
      if (!raf) raf = requestAnimationFrame(loop);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
