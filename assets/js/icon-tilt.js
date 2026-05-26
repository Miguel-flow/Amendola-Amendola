(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.icon-wrapper').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var relX = (e.clientX - rect.left) / rect.width  - 0.5;
        var relY = (e.clientY - rect.top)  / rect.height - 0.5;
        var rotY =  relX * 14;
        var rotX = -relY * 14;
        card.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease, transform 0.1s ease';
        card.style.transform  = 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateY(-6px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease';
        card.style.transform  = '';
      });
    });
  });
})();
