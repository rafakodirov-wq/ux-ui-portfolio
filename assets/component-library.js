(() => {
  function translate() {
    const language = document.documentElement.lang === 'en' ? 'en' : 'ru';
    for (const element of document.querySelectorAll('main [data-ru]')) {
      element.textContent = element.dataset[language];
    }
    const demo = document.getElementById('gesture-demo');
    const src = 'assets/component-library/liquid-navigation.html' + (language === 'en' ? '?lang=en' : '');
    if (demo.getAttribute('src') !== src) demo.setAttribute('src', src);
    document.title = language === 'en' ? 'Component Library · RZ.' : 'Библиотека компонентов · RZ.';
  }
  new MutationObserver(translate).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
  window.addEventListener('message', event => {
    if (event.source !== parent || (location.protocol !== 'file:' && event.origin !== location.origin)) return;
    if (event.data?.type === 'portfolio-language' && ['ru', 'en'].includes(event.data.lang)) {
      document.documentElement.lang = event.data.lang;
    }
  });
  translate();
})();
