(() => {
  const page = document.querySelector('.cw-case');
  const viewer = document.getElementById('viewer');
  const stage = viewer.querySelector('.cw-viewer-stage');
  const image = stage.querySelector('img');
  const full = stage.querySelector('.cw-viewer-full');
  const caption = viewer.querySelector('.cw-viewer-caption');
  const close = viewer.querySelector('.liquid-close');
  const previous = viewer.querySelector('[data-viewer-previous]');
  const next = viewer.querySelector('[data-viewer-next]');
  const zoom = viewer.querySelector('[data-viewer-zoom]');
  const links = [...page.querySelectorAll('[data-gallery]')];
  const checklist = document.querySelector('.cw-checks');
  const checks = [...checklist.querySelectorAll('input')];
  const choices = [...document.querySelectorAll('input[name="cw-scenario"]')];
  const count = document.getElementById('cw-count');
  const progress = document.getElementById('cw-progress');
  const recommendation = document.getElementById('cw-next');
  const checked = {first: [false, false, false], ready: [false, false, false]};
  const scenarios = {
    first: [
      ['Что за товар и сколько единиц нужно', 'Product and number of units', 'Уточните наименование товара и примерное количество. Этого достаточно, чтобы начать обсуждение поиска.', 'Clarify the product and approximate quantity. That is enough to start discussing sourcing.'],
      ['Куда доставлять', 'Delivery destination', 'Определите город или склад назначения.', 'Identify the destination city or warehouse.'],
      ['Что поручить сервису: поиск, выкуп или проверку', 'What to delegate: sourcing, purchasing or inspection', 'Подумайте, нужна ли помощь только с поиском или также с выкупом и проверкой.', 'Decide whether you need sourcing only or help with purchasing and inspection as well.']
    ],
    ready: [
      ['Вес и габариты партии', 'Shipment weight and dimensions', 'Попросите поставщика сообщить вес и размеры груза в упаковке.', 'Ask the supplier for the packed weight and dimensions.'],
      ['Где забрать и куда доставить', 'Pickup and delivery locations', 'Уточните город отправления и место доставки.', 'Confirm the origin city and the delivery location.'],
      ['Когда груз будет готов к отгрузке', 'When the goods will be ready for pickup', 'Уточните дату готовности партии у поставщика.', 'Confirm the pickup date with your supplier.']
    ]
  };

  function updateChecklist() {
    const situation = choices.find(choice => choice.checked).value;
    const values = checked[situation];
    checks.forEach((check, i) => {
      const label = check.nextElementSibling;
      const line = scenarios[situation][i];
      label.dataset.ru = line[0];
      label.dataset.en = line[1];
      label.textContent = text(line[0], line[1]);
      check.checked = values[i];
    });
    const total = values.filter(Boolean).length;
    const missing = scenarios[situation][values.indexOf(false)];
    count.textContent = `${total} / ${checks.length}`;
    progress.value = total;
    recommendation.textContent = missing ? text(missing[2], missing[3]) : text(
      'Вводные для первого разговора собраны. Специалист уточнит детали, прежде чем назвать стоимость.',
      'You have the details for a first conversation. A specialist can confirm the specifics before giving a quote.'
    );
  }
  choices.forEach(choice => choice.addEventListener('change', updateChecklist));
  checks.forEach((check, i) => check.addEventListener('change', () => {
    checked[choices.find(choice => choice.checked).value][i] = check.checked;
    updateChecklist();
  }));

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
    if (isFull) {
      const base = item.href.slice(0, -4);
      full.replaceChildren(...Array.from({length: 6}, (_, i) => {
        const tile = new Image(7660, 2200);
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
        link.setAttribute('aria-label', text('Увеличить: ', 'Enlarge: ') + label);
      }
    });
    page.querySelectorAll('img[data-alt-ru]').forEach(img => img.alt = title(img));
    document.title = text('ChinaWay Logistics · Доставка из Китая', 'ChinaWay Logistics · Shipping from China');
    document.querySelector('meta[name="description"]').content = text(
      'ChinaWay Logistics — кейс о дизайне и сборке лендинга логистического сервиса на Tilda.',
      'ChinaWay Logistics — a UX/UI and Tilda case study about a shipping landing page.'
    );
    viewer.setAttribute('aria-label', text('Просмотр макетов', 'Design preview'));
    close.setAttribute('aria-label', text('Закрыть', 'Close'));
    previous.setAttribute('aria-label', text('Предыдущий экран', 'Previous screen'));
    next.setAttribute('aria-label', text('Следующий экран', 'Next screen'));
    labelZoom();
    updateChecklist();
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
