// Resolve language before the case's own translation scripts initialize.
(() => {
  const params = new URLSearchParams(location.search);
  let stored;
  try { stored = localStorage.getItem('portfolio-lang'); } catch (_) {}
  const requested = params.get('lang');
  const lang = requested === 'en' || requested === 'ru' ? requested : stored === 'en' ? 'en' : 'ru';
  window.__portfolioInitialLanguage = lang;
  document.documentElement.lang = lang;
  try { localStorage.setItem('portfolio-lang', lang); } catch (_) {}
  if (requested !== lang) {
    params.set('lang', lang);
    history.replaceState(history.state, '', location.pathname + '?' + params + location.hash);
  }
})();
