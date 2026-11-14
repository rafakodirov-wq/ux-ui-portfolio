(() => {
  const page = document.querySelector('.xf-case');
  const viewer = document.getElementById('xflow-viewer');
  const stage = viewer.querySelector('.xf-viewer-stage');
  const image = stage.querySelector('img');
  const full = stage.querySelector('.xf-viewer-full');
  const caption = viewer.querySelector('.xf-viewer-caption');
  stage.tabIndex = 0;
  const close = viewer.querySelector('.liquid-close');
  const previous = viewer.querySelector('[data-viewer-previous]');
  const next = viewer.querySelector('[data-viewer-next]');
  const zoom = viewer.querySelector('[data-viewer-zoom]');
  const links = [...page.querySelectorAll('[data-gallery]')];
  let lang = 'ru';
  let items = [];
  let index = 0;
  let opener;

  const text = (ru, en) => lang === 'en' ? en : ru;
  const title = link => lang === 'en' ? link.dataset.altEn : link.dataset.altRu;
  function labelZoom() {
    zoom.setAttribute('aria-label', viewer.classList.contains('is-zoomed') ? text('Уменьшить', 'Zoom out') : text('Увеличить', 'Zoom in'));
  }
  function setZoom(on) {
    viewer.classList.toggle('is-zoomed', on);
    zoom.textContent = on ? '−' : '+';
    zoom.setAttribute('aria-pressed', String(on));
    labelZoom();
    stage.scrollLeft = stage.scrollTop = 0;
  }
  function describe() {
    image.alt = title(items[index]);
    full.setAttribute('aria-label', image.alt);
    caption.textContent = items.length > 1 ? `${index + 1} / ${items.length} · ${image.alt}` : image.alt;
  }
  function render() {
    const item = items[index];
    const isFull = item.dataset.gallery === 'full';
    viewer.classList.toggle('is-full', isFull);
    previous.hidden = next.hidden = items.length === 1;
    full.hidden = !isFull;
    image.hidden = isFull;
    if (isFull) {
      const base = item.href.slice(0, -4);
      full.replaceChildren(...Array.from({length: 4}, (_, i) => {
        const tile = new Image(5760, 3169);
        tile.alt = '';
        tile.loading = i === 0 ? 'eager' : 'lazy';
        tile.decoding = 'async';
        tile.src = `${base}-${i + 1}.png`;
        return tile;
      }));
    } else {
      image.src = item.href;
    }
    describe();
    setZoom(false);
  }
  function shift(direction) {
    index = (index + direction + items.length) % items.length;
    render();
  }

  links.forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    items = link.dataset.gallery === 'full' ? [link] : links.filter(item => item.dataset.gallery === link.dataset.gallery);
    index = items.indexOf(link);
    viewer.showModal();
    render();
    close.focus({preventScroll: true});
  }));
  previous.addEventListener('click', () => shift(-1));
  next.addEventListener('click', () => shift(1));
  zoom.addEventListener('click', () => setZoom(!viewer.classList.contains('is-zoomed')));
  close.addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target === stage || event.target === viewer) viewer.close();
  });
  viewer.addEventListener('keydown', event => {
    if (items.length < 2 || viewer.classList.contains('is-zoomed')) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    shift(event.key === 'ArrowLeft' ? -1 : 1);
  });
  viewer.addEventListener('close', () => {
    image.removeAttribute('src');
    full.replaceChildren();
    setZoom(false);
    opener?.focus({preventScroll: true});
  });

  function localize() {
    lang = document.documentElement.lang.startsWith('en') ? 'en' : 'ru';
    page.querySelectorAll('[data-ru][data-en]').forEach(element => {
      element.textContent = element.dataset[lang];
    });
    links.forEach(link => {
      const label = title(link);
      const thumb = link.querySelector('img');
      if (thumb) {
        thumb.alt = label;
        link.setAttribute('aria-label', text('Увеличить изображение «', 'Enlarge “') + label + text('»', '”'));
      }
    });
    page.querySelectorAll('img[data-alt-ru]').forEach(img => img.alt = title(img));
    document.title = text('X’FLOW GYM · Редизайн лендинга', 'X’FLOW GYM · Landing page redesign');
    document.querySelector('meta[name="description"]').content = text(
      'X’FLOW GYM — UX/UI-кейс о редизайне лендинга фитнес-клуба и пути к первой тренировке.',
      'X’FLOW GYM is a UX/UI case study on a fitness club landing page and its first-session booking journey.'
    );
    viewer.setAttribute('aria-label', text('Просмотр макетов', 'Design preview'));
    stage.setAttribute('aria-label', text('Область просмотра', 'Image viewing area'));
    close.setAttribute('aria-label', text('Закрыть', 'Close'));
    previous.setAttribute('aria-label', text('Предыдущий экран', 'Previous screen'));
    next.setAttribute('aria-label', text('Следующий экран', 'Next screen'));
    labelZoom();
    if (viewer.open) describe();
  }
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
