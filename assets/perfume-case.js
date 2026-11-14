(() => {
  const page = document.querySelector('.pm-case');
  const dialog = document.getElementById('viewer');
  const stage = dialog.querySelector('.pm-viewer-stage');
  const image = stage.querySelector('img');
  const full = stage.querySelector('.pm-viewer-full');
  const caption = dialog.querySelector('.pm-viewer-caption');
  const close = dialog.querySelector('.liquid-close');
  const previous = dialog.querySelector('[data-viewer-previous]');
  const next = dialog.querySelector('[data-viewer-next]');
  const zoom = dialog.querySelector('[data-viewer-zoom]');
  const previews = [...page.querySelectorAll('[data-preview]')];

  let lang = 'ru';
  let opener;
  let items = [];
  let index = 0;

  const text = (ru, en) => lang === 'en' ? en : ru;
  const titleOf = link => lang === 'en' ? link.dataset.altEn : link.dataset.altRu;

  function setZoom(enabled) {
    dialog.classList.toggle('is-zoomed', enabled);
    zoom.textContent = enabled ? '−' : '+';
    zoom.setAttribute('aria-pressed', String(enabled));
    zoom.setAttribute('aria-label', enabled ? text('Уменьшить', 'Zoom out') : text('Увеличить', 'Zoom in'));
    stage.scrollTop = stage.scrollLeft = 0;
  }

  function localizePreview() {
    const title = titleOf(items[index]);
    image.alt = title;
    full.setAttribute('aria-label', title);
    caption.textContent = items.length === 1 ? title : `${index + 1} / ${items.length} · ${title}`;
  }

  function renderPreview() {
    const item = items[index];
    const showFull = item.dataset.preview === 'full';
    dialog.classList.toggle('is-full', showFull);
    previous.hidden = next.hidden = items.length === 1;
    full.hidden = !showFull;
    if (showFull) {
      const base = item.href.replace(/\.png$/, '');
      full.replaceChildren(...Array.from({length: 4}, (_, i) => {
        const tile = new Image(5760, 3507);
        tile.alt = '';
        tile.loading = i === 0 ? 'eager' : 'lazy';
        tile.decoding = 'async';
        tile.src = `${base}-${i + 1}.png`;
        return tile;
      }));
      image.removeAttribute('src');
    } else {
      image.src = item.href;
    }
    localizePreview();
    setZoom(false);
  }

  function shift(direction) {
    if (items.length < 2) return;
    index = (index + direction + items.length) % items.length;
    renderPreview();
  }

  previews.forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    items = link.dataset.preview === 'full' ? [link] :
      previews.filter(item => item.dataset.preview === link.dataset.preview);
    index = items.indexOf(link);
    renderPreview();
    dialog.showModal();
    close.focus({preventScroll: true});
  }));

  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === stage || event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    full.replaceChildren();
    setZoom(false);
    opener?.focus({preventScroll: true});
  });
  previous.addEventListener('click', () => shift(-1));
  next.addEventListener('click', () => shift(1));
  zoom.addEventListener('click', () => setZoom(!dialog.classList.contains('is-zoomed')));
  dialog.addEventListener('keydown', event => {
    if (items.length > 1 && !dialog.classList.contains('is-zoomed') &&
        (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault();
      shift(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  image.addEventListener('load', () => {
    image.style.setProperty('--pm-image-width', `${image.naturalWidth}px`);
  });

  function localize() {
    lang = document.documentElement.lang.startsWith('en') ? 'en' : 'ru';
    page.querySelectorAll('[data-ru][data-en]').forEach(element => {
      element.textContent = element.dataset[lang];
    });
    page.querySelectorAll('img[data-alt-ru]').forEach(element => {
      element.alt = titleOf(element);
    });
    previews.forEach(link => {
      const title = titleOf(link);
      const thumb = link.querySelector('img');
      if (thumb) thumb.alt = title;
      link.setAttribute('aria-label', (thumb ? text('Увеличить: ', 'Enlarge: ') : text('Посмотреть: ', 'View: ')) + title);
    });
    document.title = text('Perfume-Mode · Дизайн парфюмерного бутика', 'Perfume-Mode · Fragrance boutique design');
    document.querySelector('meta[name="description"]').content = text(
      'Perfume-Mode — UX/UI-кейс о дизайне цифрового парфюмерного бутика.',
      'Perfume-Mode is a UX/UI case study about designing an online fragrance boutique.'
    );
    dialog.setAttribute('aria-label', text('Просмотр макета', 'Mockup preview'));
    close.setAttribute('aria-label', text('Закрыть', 'Close'));
    previous.setAttribute('aria-label', text('Предыдущий макет', 'Previous mockup'));
    next.setAttribute('aria-label', text('Следующий макет', 'Next mockup'));
    zoom.setAttribute('aria-label', dialog.classList.contains('is-zoomed') ? text('Уменьшить', 'Zoom out') : text('Увеличить', 'Zoom in'));
    if (dialog.open) localizePreview();
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
