/* One owner for anchor navigation. Language/contact dropdowns are supplied by
   case-runtime.js; existing page translators remain responsible for content. */
(() => {
  const root = document.getElementById('rz-case-header');
  if (!root || root.dataset.navigationReady) return;
  root.dataset.navigationReady = 'true';
  const links = [...root.querySelectorAll('.rz-link')];
  const currentLanguage = () => document.documentElement.lang.startsWith('en') ? 'en' : 'ru';
  const targetFor = link => document.querySelector(currentLanguage() === 'en' && link.dataset.targetEn
    ? link.dataset.targetEn : link.getAttribute('href'));
  let frame = 0;
  let pendingAnchor = null;
  let anchorDeadline = 0;

  function select(link) {
    for (const item of links) {
      const selected = item === link;
      if (item.classList.contains('active') !== selected) item.classList.toggle('active', selected);
      if (selected && item.getAttribute('aria-current') !== 'location') item.setAttribute('aria-current', 'location');
      if (!selected && item.hasAttribute('aria-current')) item.removeAttribute('aria-current');
    }
  }
  function update() {
    frame = 0;
    root.querySelector('.rz-nav').classList.toggle('scrolled', scrollY > 35);
    if (pendingAnchor && performance.now() < anchorDeadline) {
      select(pendingAnchor);
      requestUpdate();
      return;
    }
    pendingAnchor = null;
    const marker = Math.min(250, innerHeight * .38);
    let active = links[0];
    if (scrollY > 4) {
      for (const link of links) {
        const target = targetFor(link);
        if (!target || !target.getClientRects().length) continue;
        if (target.getBoundingClientRect().top <= marker) active = link;
        else break;
      }
    }
    select(active);
  }
  function requestUpdate() { if (!frame) frame = requestAnimationFrame(update); }
  function translateControls() {
    const language = currentLanguage();
    links.forEach(link => { if (link.textContent !== link.dataset[language]) link.textContent = link.dataset[language]; });
    root.querySelector('.rz-back').setAttribute('aria-label', language === 'en' ? 'Back to projects' : 'Назад к проектам');
    root.querySelector('.rz-contact').setAttribute('aria-label', language === 'en' ? 'Contact' : 'Связаться');
    root.querySelector('.rz-nav').setAttribute('aria-label', language === 'en' ? 'Project navigation' : 'Навигация по проекту');
    requestUpdate();
  }
  // Capture prevents old case-specific click handlers from firing twice.
  window.addEventListener('click', event => {
    const button = event.target.closest?.('#rz-case-header .rz-back');
    const link = event.target.closest?.('#rz-case-header .rz-link');
    if (!button && !link) return;
    if (link && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (button) {
      if (window.parent !== window) window.parent.postMessage({ type: 'portfolio-case-back' }, '*');
      else location.href = 'index.html?lang=' + currentLanguage() + '#work';
      return;
    }
    const target = targetFor(link);
    if (!target) return;
    const top = link === links[0] ? 0 : Math.max(0, target.getBoundingClientRect().top + scrollY - root.getBoundingClientRect().bottom - 24);
    pendingAnchor = link;
    anchorDeadline = performance.now() + (matchMedia('(prefers-reduced-motion:reduce)').matches ? 0 : 1000);
    select(link);
    scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth' });
    requestUpdate();
  }, true);
  // User scrolling interrupts a requested smooth anchor transition.
  for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) {
    window.addEventListener(type, () => { pendingAnchor = null; requestUpdate(); }, { passive: true });
  }
  for (const type of ['scroll', 'resize', 'load', 'pageshow']) window.addEventListener(type, requestUpdate, { passive: true });
  window.addEventListener('scrollend', () => { pendingAnchor = null; requestUpdate(); });
  new MutationObserver(translateControls).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  new ResizeObserver(requestUpdate).observe(document.body);
  translateControls();
})();
