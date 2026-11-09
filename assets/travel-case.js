(() => {
  const page = document.querySelector('.travel-case');
  const byId = id => document.getElementById(id);
  const gallery = byId('gallery');
  const preview = byId('gallery-preview');
  const image = byId('gallery-image');
  const caption = byId('caption');
  const galleryLayer = byId('gallery-layer');
  const outgoingImage = byId('gallery-outgoing');
  const themeButtons = [...gallery.querySelectorAll('[data-theme]')];
  const dialog = byId('overlay');
  const modalImage = byId('modal-img');
  const modalCaption = byId('count');
  const close = byId('close');
  const previous = byId('modal-prev');
  const next = byId('modal-next');
  const zoomButton = byId('modal-zoom');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  // Each pair represents the same screen in light and dark themes.
  const screens = [
    [16, 15, 'Приветствие', 'Welcome'],
    [14, 13, 'Поиск билетов', 'Flight search'],
    [10, 9, 'Список рейсов', 'Flight results'],
    [12, 11, 'Обзор Стамбула', 'Istanbul overview'],
    [8, 7, 'Карточка отеля', 'Hotel details'],
    [2, 1, 'Избранное', 'Favourites'],
    [6, 5, 'Мои поездки', 'My trips'],
    [4, 3, 'Профиль', 'Profile']
  ];

  let lang = 'ru';
  let index = 0;
  let theme = 0;
  let timer;
  let galleryVisible = false;
  let frameRequest = 0;
  let frameAnimations = [];
  let previewItems = [];
  let modalIndex = 0;
  let opener;
  let zoom = 1;
  let offsetX = 0;
  let offsetY = 0;

  const text = (ru, en) => lang === 'en' ? en : ru;
  const source = id => `assets/travel/screen_${String(id).padStart(2, '0')}.png`;
  const wrap = (i, size) => (i + size) % size;
  const previewLabel = title => text('Увеличить: ', 'Enlarge: ') + title;
  const getGalleryItems = () => screens.map(screen => ({
    src: source(screen[theme]),
    title: text(screen[2], screen[3])
  }));

  const dots = screens.map((screen, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    dot.addEventListener('click', () => changeScreen(i));
    byId('dots').append(dot);
    return dot;
  });

  function showGalleryFrame(src, direction) {
    const request = ++frameRequest;
    frameAnimations.forEach(animation => animation.cancel());
    frameAnimations = [];

    const previousSrc = galleryLayer.hidden ? image.getAttribute('src') : outgoingImage.getAttribute('src');
    const animate = direction !== null && !reduced.matches && previousSrc && previousSrc !== src;
    galleryLayer.hidden = !animate;
    image.style.opacity = animate ? '0' : '';
    if (animate) outgoingImage.src = previousSrc;
    image.src = src;
    if (!animate) return;

    function finish() {
      if (request !== frameRequest) return;
      frameAnimations.forEach(animation => animation.cancel());
      galleryLayer.hidden = true;
      image.style.opacity = '';
      frameAnimations = [];
    }

    image.decode().then(() => {
      if (request !== frameRequest) return;
      image.style.opacity = '';
      const timing = {duration: 510, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both'};
      frameAnimations = [
        outgoingImage.animate([
          {opacity: 1, transform: 'translateX(0) scale(1)'},
          {opacity: 0, transform: `translateX(${-direction * 18}px) scale(.986)`}
        ], timing),
        image.animate([
          {opacity: 0, transform: `translateX(${direction * 22}px) scale(.986)`},
          {opacity: 1, transform: 'translateX(0) scale(1)'}
        ], timing)
      ];
      frameAnimations[1].onfinish = finish;
    }, finish);
  }

  function renderGallery(direction = null) {
    const item = getGalleryItems()[index];
    if (image.getAttribute('src') !== item.src) {
      // The aspect ratio belongs to the source artwork, including cropped mockups.
      const id = screens[index][theme];
      const full = [5, 6, 11, 12, 13, 14, 15, 16].includes(id);
      image.width = full ? 1059 : 1056;
      image.height = full ? 2300 : 1196;
      showGalleryFrame(item.src, direction);
    }
    image.alt = item.title;
    preview.setAttribute('aria-label', previewLabel(item.title));
    caption.textContent = `${index + 1} / ${screens.length} · ${item.title}`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
      dot.setAttribute('aria-current', String(i === index));
      dot.setAttribute('aria-label', `${i + 1}. ${text(screens[i][2], screens[i][3])}`);
    });
  }

  function updateAutoplay() {
    clearInterval(timer);
    if (!reduced.matches && galleryVisible && !dialog.open && !document.hidden) {
      timer = setInterval(() => {
        index = wrap(index + 1, screens.length);
        renderGallery(1);
      }, 3000);
    }
  }

  function changeScreen(i, direction = Math.sign(i - index)) {
    index = wrap(i, screens.length);
    renderGallery(direction);
    updateAutoplay();
  }

  function applyZoom() {
    modalImage.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`;
    dialog.classList.toggle('is-zoomed', zoom > 1);
    zoomButton.textContent = zoom > 1 ? '−' : '+';
    zoomButton.setAttribute('aria-label', zoom > 1 ? text('Уменьшить', 'Zoom out') : text('Увеличить', 'Zoom in'));
  }

  function setZoom(value) {
    zoom = Math.min(4, Math.max(1, value));
    if (zoom === 1) offsetX = offsetY = 0;
    applyZoom();
  }

  function renderModal() {
    const item = previewItems[modalIndex];
    modalImage.src = item.src;
    modalImage.alt = item.title;
    modalCaption.textContent = `${modalIndex + 1} / ${previewItems.length} · ${item.title}`;
    previous.hidden = next.hidden = previewItems.length < 2;
    setZoom(1);
  }

  function openModal(items, start, trigger) {
    previewItems = items;
    modalIndex = start;
    opener = trigger;
    renderModal();
    dialog.showModal();
    updateAutoplay();
    close.focus({preventScroll: true});
  }

  function shiftModal(direction) {
    modalIndex = wrap(modalIndex + direction, previewItems.length);
    renderModal();
    if (opener === preview) changeScreen(modalIndex, direction);
  }

  function editorialItems(group) {
    return [...group.querySelectorAll('[data-travel-screen]')].map(button => {
      const description = button.closest('figure').querySelector('figcaption');
      return {src: source(button.dataset.travelScreen), title: description.dataset[lang]};
    });
  }

  function localize() {
    lang = document.documentElement.lang.startsWith('en') ? 'en' : 'ru';
    page.querySelectorAll('[data-ru][data-en]').forEach(element => {
      element.textContent = element.dataset[lang];
    });
    page.querySelectorAll('[data-alt-ru]').forEach(element => {
      element.alt = text(element.dataset.altRu, element.dataset.altEn);
    });
    page.querySelectorAll('[data-travel-screen]').forEach(button => {
      const title = button.closest('figure').querySelector('figcaption').textContent;
      button.setAttribute('aria-label', previewLabel(title));
      button.querySelector('img').alt = title;
    });

    document.title = text('Путешествие начинается здесь · UX/UI-кейс', 'Your journey starts here · UX/UI case study');
    dialog.setAttribute('aria-label', text('Просмотр макета', 'Screen preview'));
    byId('theme-label').setAttribute('aria-label', text('Тема интерфейса', 'Interface theme'));
    close.setAttribute('aria-label', text('Закрыть', 'Close'));
    [byId('prev'), previous].forEach(button => button.setAttribute('aria-label', text('Предыдущий экран', 'Previous screen')));
    [byId('next'), next].forEach(button => button.setAttribute('aria-label', text('Следующий экран', 'Next screen')));
    renderGallery();
    if (dialog.open) {
      previewItems = opener === preview ? getGalleryItems() : editorialItems(opener.closest('[data-preview-group]'));
      renderModal();
    }
    updateAutoplay();
  }

  themeButtons.forEach((button, i) => button.addEventListener('click', () => {
    theme = i;
    themeButtons.forEach((item, number) => {
      item.classList.toggle('active', number === theme);
      item.setAttribute('aria-pressed', String(number === theme));
    });
    renderGallery(0);
    updateAutoplay();
  }));

  byId('prev').addEventListener('click', () => changeScreen(index - 1));
  byId('next').addEventListener('click', () => changeScreen(index + 1));
  preview.addEventListener('click', () => openModal(getGalleryItems(), index, preview));
  page.querySelectorAll('[data-preview-group]').forEach(group => {
    group.querySelectorAll('[data-travel-screen]').forEach((button, i) => {
      button.addEventListener('click', () => openModal(editorialItems(group), i, button));
    });
  });

  const galleryObserver = new IntersectionObserver(([entry]) => {
    galleryVisible = entry.isIntersecting;
    updateAutoplay();
  });
  galleryObserver.observe(preview);
  document.addEventListener('visibilitychange', updateAutoplay);
  reduced.addEventListener('change', updateAutoplay);

  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (dialog.open) return;
    setZoom(1);
    opener?.focus({preventScroll: true});
    updateAutoplay();
  });
  previous.addEventListener('click', () => shiftModal(-1));
  next.addEventListener('click', () => shiftModal(1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      shiftModal(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  const toggleZoom = () => setZoom(zoom > 1 ? 1 : 2.2);
  zoomButton.addEventListener('click', toggleZoom);
  modalImage.addEventListener('dblclick', toggleZoom);

  const pointers = new Map();
  let start;
  let pinch;
  const distance = () => {
    const [first, second] = pointers.values();
    return Math.hypot(first.x - second.x, first.y - second.y);
  };
  modalImage.addEventListener('pointerdown', event => {
    modalImage.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
    if (pointers.size === 1) start = {x: event.clientX, y: event.clientY, offsetX, offsetY};
    if (pointers.size === 2) {
      pinch = {distance: distance(), zoom};
      start = null;
    }
  });
  modalImage.addEventListener('pointermove', event => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
    if (pointers.size === 2 && pinch) {
      setZoom(pinch.zoom * distance() / Math.max(1, pinch.distance));
    } else if (zoom > 1 && start) {
      offsetX = start.offsetX + event.clientX - start.x;
      offsetY = start.offsetY + event.clientY - start.y;
      applyZoom();
    }
  });
  modalImage.addEventListener('pointerup', event => {
    const dx = start ? event.clientX - start.x : 0;
    pointers.delete(event.pointerId);
    if (zoom === 1 && event.pointerType === 'touch' && Math.abs(dx) > 60) {
      shiftModal(dx < 0 ? 1 : -1);
    }
    start = pinch = null;
  });
  modalImage.addEventListener('pointercancel', event => {
    pointers.delete(event.pointerId);
    start = pinch = null;
  });
  dialog.addEventListener('close', () => {
    pointers.clear();
    start = pinch = null;
  });

  new MutationObserver(localize).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
  window.addEventListener('message', event => {
    if (event.source !== window && event.source !== window.parent) return;
    const {type, lang: value} = event.data || {};
    if (type !== 'portfolio-language' || (value !== 'en' && value !== 'ru')) return;
    if (document.documentElement.lang !== value) document.documentElement.lang = value;
    if (window.parent === window) {
      const url = new URL(location.href);
      if (url.searchParams.get('lang') !== value) {
        url.searchParams.set('lang', value);
        try { history.replaceState(history.state, '', url); } catch (_) {}
      }
    }
  });
  localize();
})();
