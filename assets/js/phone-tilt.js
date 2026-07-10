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
        (hovering ? ' translateY(-10px) scale(1.03)' : '');

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
      targetRotY = relX * 24;
      targetRotX = -relY * 16;
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
