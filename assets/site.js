(() => {
  if (window.__rzPortfolioContactLoaded) return;
  window.__rzPortfolioContactLoaded = true;
  const trigger = document.querySelector('.portfolio-contact');
  if (!trigger) return;

  const label = () => document.documentElement.lang === 'en' ? 'Contact options' : 'Способы связи';
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-expanded', 'false');

  const panel = document.createElement('div');
  panel.className = 'contact-chooser';
  panel.id = 'contact-options';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', label());
  panel.innerHTML = '<div class="contact-chooser-heading">Способы связи / Get in touch</div><a href="https://t.me/thereallraff" target="_blank" rel="noopener noreferrer"><span class="contact-chooser-icon" aria-hidden="true">✈</span><span class="contact-chooser-label"><strong>Telegram</strong><small>@thereallraff</small></span><span class="contact-chooser-arrow" aria-hidden="true">↗</span></a><a href="https://www.linkedin.com/in/ravshanbekzoirov" target="_blank" rel="noopener noreferrer"><span class="contact-chooser-icon" aria-hidden="true">in</span><span class="contact-chooser-label"><strong>LinkedIn</strong><small>ravshanbekzoirov</small></span><span class="contact-chooser-arrow" aria-hidden="true">↗</span></a><a href="mailto:rafakodirov@gmail.com"><span class="contact-chooser-icon" aria-hidden="true">✉</span><span class="contact-chooser-label"><strong>Email</strong><small>rafakodirov@gmail.com</small></span><span class="contact-chooser-arrow" aria-hidden="true">↗</span></a>';
  document.body.append(panel);

  let open = false;
  const position = () => {
    const rect = trigger.getBoundingClientRect();
    const width = Math.min(316, window.innerWidth - 24);
    panel.style.left = `${Math.max(12, Math.min(rect.right - width, window.innerWidth - width - 12))}px`;
    panel.style.top = `${Math.min(rect.bottom + 10, window.innerHeight - panel.offsetHeight - 12)}px`;
  };
  const setOpen = next => {
    open = next;
    trigger.setAttribute('aria-expanded', String(next));
    panel.classList.toggle('is-open', next);
    if (next) { panel.setAttribute('aria-label', label()); position(); panel.querySelector('a')?.focus(); }
    else trigger.focus({ preventScroll: true });
  };
  trigger.addEventListener('click', event => { event.preventDefault(); setOpen(!open); });
  trigger.addEventListener('keydown', event => { if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); setOpen(!open); } });
  document.addEventListener('pointerdown', event => { if (open && !panel.contains(event.target) && !trigger.contains(event.target)) setOpen(false); });
  document.addEventListener('keydown', event => {
    if (!open) return;
    if (event.key === 'Escape') { setOpen(false); return; }
    if (event.key !== 'Tab') return;
    const focusable = [...panel.querySelectorAll('a')];
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  window.addEventListener('resize', () => open && position());
  window.addEventListener('scroll', () => open && position(), true);
  panel.addEventListener('click', () => setOpen(false));

  // ChinaWay-style scroll spy: one stable threshold and one update per frame.
  // It deliberately doesn't use IntersectionObserver, whose overlapping
  // callbacks caused the highlighted item to briefly flicker.
  const navigationLinks = [...document.querySelectorAll('.tabs a[href^="#"], .case-links a[href^="#"], .travel-link[href^="#"]')]
    .map(link => ({ link, target: document.querySelector(link.getAttribute('href')) }))
    .filter(item => item.target);
  if (navigationLinks.length) {
    let frame;
    const updateNavigation = () => {
      frame = undefined;
      const offset = Math.min(250, window.innerHeight * .38);
      let active = navigationLinks[0];
      if (window.scrollY > 4) {
        for (const item of navigationLinks) {
          if (item.target.getBoundingClientRect().top <= offset) active = item;
          else break;
        }
      }
      for (const item of navigationLinks) {
        const selected = item === active;
        item.link.classList.toggle('active', selected);
        if (selected) item.link.setAttribute('aria-current', 'location');
        else item.link.removeAttribute('aria-current');
      }
    };
    const requestNavigationUpdate = () => {
      if (!frame) frame = requestAnimationFrame(updateNavigation);
    };
    window.addEventListener('scroll', requestNavigationUpdate, { passive: true });
    window.addEventListener('resize', requestNavigationUpdate, { passive: true });
    navigationLinks.forEach(item => item.link.addEventListener('click', () => setTimeout(updateNavigation, 500)));
    updateNavigation();
  }
})();
