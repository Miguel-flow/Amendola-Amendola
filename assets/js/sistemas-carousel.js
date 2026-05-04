(function () {
  function createButton(direction) {
    const button = document.createElement("button");
    const isPrevious = direction === "prev";

    button.type = "button";
    button.className = `functionality-gallery-button gallery-${direction}`;
    button.setAttribute(isPrevious ? "data-carousel-prev" : "data-carousel-next", "");
    button.setAttribute("aria-label", isPrevious ? "Funcionalidade anterior" : "Proxima funcionalidade");
    button.innerHTML = `<i class="fa-solid fa-chevron-${isPrevious ? "left" : "right"}" aria-hidden="true"></i>`;

    return button;
  }

  function setupCarousel(section) {
    if (section.dataset.carouselReady === "true") return;

    const track = section.querySelector(".functionalities-container");
    if (!track) return;

    section.dataset.carouselReady = "true";
    section.classList.add("functionality-gallery");
    track.classList.add("functionality-track");

    section.querySelectorAll(".functionality-gallery-controls, .functionality-gallery-dots").forEach((el) => el.remove());
    track.querySelectorAll('.functionality[aria-hidden="true"]').forEach((el) => el.remove());

    let viewport = section.querySelector(".functionality-gallery-viewport");
    if (!viewport) {
      viewport = document.createElement("div");
      viewport.className = "functionality-gallery-viewport";
      viewport.setAttribute("aria-label", "Galeria automatica de funcionalidades");
      track.parentNode.insertBefore(viewport, track);
      viewport.appendChild(track);
    }

    let previousButton = viewport.querySelector("[data-carousel-prev], [data-gallery-prev]");
    let nextButton = viewport.querySelector("[data-carousel-next], [data-gallery-next]");

    if (!previousButton) {
      previousButton = createButton("prev");
      viewport.insertBefore(previousButton, viewport.firstChild);
    }

    if (!nextButton) {
      nextButton = createButton("next");
      viewport.appendChild(nextButton);
    }

    const originalCards = Array.from(track.children).filter((el) => el.classList.contains("functionality"));
    if (originalCards.length < 2) return;

    let position = 0;
    let loopWidth = 0;
    let lastTime = null;
    const speed = Number(section.dataset.carouselSpeed || 62);

    function appendCloneSet() {
      originalCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
      });
    }

    function measureLoop() {
      const firstClone = track.children[originalCards.length];
      loopWidth = firstClone ? firstClone.offsetLeft : track.scrollWidth / 2;
    }

    function normalizePosition() {
      if (!loopWidth) return;
      while (position >= loopWidth) position -= loopWidth;
      while (position < 0) position += loopWidth;
    }

    function render() {
      track.style.transform = `translate3d(${-position}px, 0, 0)`;
    }

    function getStep() {
      const firstCard = track.querySelector(".functionality");
      if (!firstCard) return 320;

      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap || 0);
      return firstCard.getBoundingClientRect().width + gap;
    }

    function fillLoop() {
      appendCloneSet();
      measureLoop();
      ensureLoopFill();
    }

    function ensureLoopFill() {
      let guard = 0;
      while (track.scrollWidth < loopWidth + viewport.clientWidth + getStep() && guard < 6) {
        appendCloneSet();
        guard += 1;
      }
    }

    function moveManual(direction) {
      measureLoop();
      position += direction * getStep();
      normalizePosition();
      render();
      lastTime = null;
    }

    function animate(time) {
      if (!loopWidth) measureLoop();
      if (lastTime === null) lastTime = time;

      const delta = Math.min(time - lastTime, 64);
      lastTime = time;
      position += (speed * delta) / 1000;
      normalizePosition();
      render();

      window.requestAnimationFrame(animate);
    }

    previousButton.addEventListener("click", () => moveManual(-1));
    nextButton.addEventListener("click", () => moveManual(1));
    window.addEventListener("resize", () => {
      measureLoop();
      ensureLoopFill();
      measureLoop();
      normalizePosition();
      render();
    });

    window.requestAnimationFrame(() => {
      fillLoop();
      measureLoop();
      render();
      window.requestAnimationFrame(animate);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".page-sistema .functionalities").forEach(setupCarousel);
  });
})();
