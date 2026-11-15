(() => {
  const page = document.querySelector('.ai-case');
  if (!page) return;
  const localize = () => {
    const lang = document.documentElement.lang.startsWith('en') ? 'en' : 'ru';
    page.querySelectorAll('[data-ru][data-en]').forEach(el => { el.textContent = el.dataset[lang]; });
    document.title = lang === 'en' ? 'AI for Images · UX/UI Case Study' : 'ИИ для Изображений · UX/UI-кейс';
    document.querySelector('meta[name="description"]').content = lang === 'en'
      ? 'AI for Images is a UX/UI case study of a tool for creating and refining images.'
      : 'ИИ для Изображений — UX/UI-кейс инструмента для создания и доработки изображений.';
  };
  new MutationObserver(localize).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
  window.addEventListener('message', event => {
    const lang = event.data?.type === 'portfolio-language' ? event.data.lang : null;
    if ((lang === 'ru' || lang === 'en') && document.documentElement.lang !== lang) document.documentElement.lang = lang;
  });
  localize();
})();
