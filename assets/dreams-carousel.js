(() => {
  const gallery = document.querySelector('.lato-carousel');
  const viewport = gallery.querySelector('.lato-viewport');
  const track = gallery.querySelector('.lato-track');
  const slides = [...track.querySelectorAll('.lato-slide')];
  const dots = [...gallery.querySelectorAll('.lato-dot')];
  const playButton = gallery.querySelector('.dr-gallery-play');
  const viewer = document.getElementById('dreams-viewer');
  const area = viewer.querySelector('.lato-viewer-image-area');
  const image = area.querySelector('img');
  const caption = viewer.querySelector('.lato-viewer-caption');
  const close = viewer.querySelector('.lato-viewer-close');
  const zoomButton = viewer.querySelector('.lato-viewer-zoom');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let viewed = 0;
  let opener;
  let timer;
  let visible = false;
  let playing = !reduce.matches;
  let start = null;
  let zoom = 1;
  let panX = 0;
  let panY = 0;
  let lastTap = 0;
  const pointers = new Map();
  let gesture;
  const en = () => document.documentElement.lang === 'en';
  const wrap = i => (i + slides.length) % slides.length;
  const slideTitle = slide => slide.querySelector('figcaption strong').dataset[en() ? 'en' : 'ru'];

  function updatePlay() {
    clearInterval(timer);
    playButton.setAttribute('aria-pressed', String(!playing));
    playButton.setAttribute('aria-label', playing
      ? (en() ? 'Pause slideshow' : 'Приостановить автопрокрутку')
      : (en() ? 'Play slideshow' : 'Запустить автопрокрутку'));
    playButton.firstElementChild.textContent = playing ? 'Ⅱ' : '▶';
    if (playing && visible && !document.hidden && !viewer.open) {
      timer = setInterval(() => {
        if (!track.contains(document.activeElement)) go(index + 1);
      }, 3000);
    }
  }

  function go(target) {
    const looping = target < 0 || target >= slides.length;
    index = wrap(target);
    viewport.classList.toggle('is-looping', looping);
    track.style.transform = `translate3d(${-100 * index}%,0,0)`;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-current', i === index);
      slide.inert = i !== index;
      slide.setAttribute('aria-hidden', String(i !== index));
      dots[i].setAttribute('aria-current', String(i === index));
    });
    if (looping) {
      void track.offsetWidth;
      viewport.classList.remove('is-looping');
    }
  }

  const move = target => { go(target); updatePlay(); };
  gallery.querySelector('.lato-prev').addEventListener('click', () => move(index - 1));
  gallery.querySelector('.lato-next').addEventListener('click', () => move(index + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => move(i)));
  playButton.addEventListener('click', () => { playing = !playing; updatePlay(); });
  reduce.addEventListener('change', event => { playing = !event.matches; updatePlay(); });
  document.addEventListener('visibilitychange', updatePlay);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    updatePlay();
  }).observe(gallery);

  viewport.addEventListener('pointerdown', event => {
    if (event.isPrimary) start = {x: event.clientX, y: event.clientY};
  });
  let suppressClick = false;
  viewport.addEventListener('pointerup', event => {
    if (!start || !event.isPrimary) return;
    const dx = event.clientX - start.x;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(event.clientY - start.y)) {
      suppressClick = true;
      move(index + (dx < 0 ? 1 : -1));
      setTimeout(() => { suppressClick = false; }, 0);
    }
    start = null;
  });
  viewport.addEventListener('pointercancel', () => { start = null; });
  viewport.addEventListener('click', event => {
    if (suppressClick) event.stopImmediatePropagation();
  }, true);

  function describe() {
    image.alt = slideTitle(slides[viewed]);
    caption.textContent = `${viewed + 1} / ${slides.length} · ${image.alt}`;
  }

  function updateZoom(scale) {
    zoom = Math.max(1, Math.min(5, scale));
    const limitX = image.offsetWidth * (zoom - 1) / 2;
    const limitY = image.offsetHeight * (zoom - 1) / 2;
    panX = Math.max(-limitX, Math.min(limitX, panX));
    panY = Math.max(-limitY, Math.min(limitY, panY));
    viewer.classList.toggle('is-zoomed', zoom > 1);
    image.style.transform = `translate(${panX}px,${panY}px) scale(${zoom})`;
    zoomButton.textContent = zoom > 1 ? '−' : '+';
    zoomButton.setAttribute('aria-pressed', String(zoom > 1));
    zoomButton.setAttribute('aria-label', zoom > 1
      ? (en() ? 'Zoom out' : 'Уменьшить')
      : (en() ? 'Zoom in' : 'Увеличить'));
  }

  function show(target) {
    viewed = wrap(target);
    const button = slides[viewed].querySelector('button');
    panX = panY = 0;
    updateZoom(1);
    image.src = button.dataset.original;
    describe();
  }

  slides.forEach((slide, i) => {
    const button = slide.querySelector('button');
    button.addEventListener('click', () => {
      opener = button;
      show(i);
      viewer.showModal();
      close.focus({preventScroll: true});
      updatePlay();
    });
  });

  close.addEventListener('click', () => viewer.close());
  viewer.querySelector('.lato-viewer-prev').addEventListener('click', () => show(viewed - 1));
  viewer.querySelector('.lato-viewer-next').addEventListener('click', () => show(viewed + 1));
  const toggleZoom = () => { panX = panY = 0; updateZoom(zoom > 1 ? 1 : 2.3); };
  zoomButton.addEventListener('click', toggleZoom);
  viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('close', () => {
    pointers.clear();
    gesture = null;
    lastTap = 0;
    image.removeAttribute('src');
    opener?.focus({preventScroll: true});
    updatePlay();
  });
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      show(viewed + (event.key === 'ArrowRight' ? 1 : -1));
      event.preventDefault();
    }
  });

  const point = event => ({x: event.clientX, y: event.clientY});
  function distance() {
    const [a, b] = pointers.values();
    return Math.hypot(a.x - b.x, a.y - b.y);
  }
  area.addEventListener('pointerdown', event => {
    if (event.button !== 0 || pointers.size === 2) return;
    area.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, point(event));
    gesture = pointers.size === 2
      ? {distance: distance(), zoom}
      : {start: point(event), panX, panY};
  });
  area.addEventListener('pointermove', event => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, point(event));
    if (pointers.size === 2) {
      updateZoom(gesture.zoom * distance() / Math.max(1, gesture.distance));
    } else if (gesture?.start && zoom > 1) {
      panX = gesture.panX + event.clientX - gesture.start.x;
      panY = gesture.panY + event.clientY - gesture.start.y;
      updateZoom(zoom);
    }
  });
  function finishPointer(event) {
    if (!pointers.delete(event.pointerId)) return;
    const start = gesture?.start;
    if (!pointers.size && start && event.type === 'pointerup') {
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (zoom === 1 && Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) show(viewed + (dx < 0 ? 1 : -1));
      if (Math.hypot(dx, dy) < 18) {
        const now = Date.now();
        if (now - lastTap < 330) { toggleZoom(); lastTap = 0; }
        else lastTap = now;
      }
    }
    gesture = null;
  }
  area.addEventListener('pointerup', finishPointer);
  area.addEventListener('pointercancel', finishPointer);
  area.addEventListener('wheel', event => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    updateZoom(zoom * (event.deltaY < 0 ? 1.12 : .89));
  }, {passive: false});

  function localize() {
    const language = en() ? 'en' : 'ru';
    document.querySelectorAll('[data-label-ru][data-label-en]').forEach(element => {
      element.setAttribute('aria-label', element.dataset[language === 'en' ? 'labelEn' : 'labelRu']);
    });
    slides.forEach(slide => {
      const button = slide.querySelector('button');
      const title = slideTitle(slide);
      button.setAttribute('aria-label', language === 'en' ? `Enlarge ${title}` : `Увеличить «${title}»`);
      button.querySelector('img').alt = title;
    });
    if (viewer.open) describe();
    updateZoom(zoom);
    updatePlay();
  }

  go(0);
  new MutationObserver(localize).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
  localize();
})();
