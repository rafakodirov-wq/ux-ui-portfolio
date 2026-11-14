(() => {
  const page = document.querySelector('.dr-case');
  const filters = page.querySelector('.dr-filters');
  const entries = [...page.querySelectorAll('.dr-record')];
  const count = document.getElementById('dr-count');
  const empty = document.getElementById('dr-empty');

  function filterRecords() {
    const {mood, theme} = filters.elements;
    let total = 0;
    entries.forEach(entry => {
      const visible = (!mood.value || mood.value === entry.dataset.mood)
        && (!theme.value || theme.value === entry.dataset.theme);
      entry.hidden = !visible;
      if (visible) total++;
    });
    count.textContent = `${total} / ${entries.length}`;
    empty.hidden = total !== 0;
  }

  filters.addEventListener('submit', event => event.preventDefault());
  filters.addEventListener('change', filterRecords);
  filters.addEventListener('reset', () => setTimeout(filterRecords, 0));

  function localize() {
    const en = document.documentElement.lang === 'en';
    const lang = en ? 'en' : 'ru';
    page.querySelectorAll('[data-ru][data-en]').forEach(element => {
      element.textContent = element.dataset[lang];
    });
    document.title = en ? 'Archive of Lost Dreams · UX/UI' : 'Архив потерянных снов · UX/UI';
    document.querySelector('meta[name="description"]').content = en
      ? 'A website concept for exploring dreams by image, mood and theme.'
      : 'Авторская концепция сайта, где сны можно искать по образам, настроениям и темам.';
  }

  new MutationObserver(localize).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
  window.addEventListener('message', event => {
    if (event.source !== window && event.source !== window.parent) return;
    const {type, lang} = event.data || {};
    if (type !== 'portfolio-language' || (lang !== 'en' && lang !== 'ru')) return;
    document.documentElement.lang = lang;
    if (window.parent !== window) return;
    const url = new URL(location.href);
    if (url.searchParams.get('lang') !== lang) {
      url.searchParams.set('lang', lang);
      try { history.replaceState(history.state, '', url); } catch (_) {}
    }
  });
  localize();
  filterRecords();
})();
