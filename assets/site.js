(() => {
  if (window.__rzPortfolioContactLoaded) return;
  window.__rzPortfolioContactLoaded = true;

  // === 1. ОЧИСТКА СУЩЕСТВУЮЩИХ КНОПОК ===
  // Убираем старые обработчики с верхней кнопки (не удаляя её)
  const navTrigger = document.querySelector('.portfolio-contact');
  if (navTrigger) {
    const newNavTrigger = navTrigger.cloneNode(true);
    navTrigger.parentNode.replaceChild(newNavTrigger, navTrigger);
    newNavTrigger.removeAttribute('aria-haspopup');
    newNavTrigger.removeAttribute('aria-expanded');
  }

  // УДАЛЯЕМ ВСЕ существующие плавающие кнопки, чтобы не было дублей (если они прописаны в HTML кейсов)
  document.querySelectorAll('.floating-contact').forEach(btn => btn.remove());

  // === 2. СОЗДАЁМ ПЛАВАЮЩУЮ КНОПКУ ===
  const floatBtn = document.createElement('button');
  floatBtn.className = 'floating-contact';
  floatBtn.setAttribute('aria-label', 'Способы связи');
  floatBtn.setAttribute('aria-haspopup', 'dialog');
  floatBtn.setAttribute('aria-expanded', 'false');
  
  // Language is defined by <html lang>, not by the text on the switcher:
  // the switcher shows the CURRENT language (RU/EN).
  const updateFloatBtnText = () => {
    const isEn = document.documentElement.lang.toLowerCase().startsWith('en');
    const label = floatBtn.querySelector('.floating-contact-label');
    if (label) label.textContent = isEn ? 'Contact' : 'Связаться';
    floatBtn.setAttribute('aria-label', isEn ? 'Contact options' : 'Способы связи');
    const heading = panel.querySelector('.contact-chooser-heading');
    if (heading) heading.textContent = isEn ? 'GET IN TOUCH' : 'СПОСОБЫ СВЯЗИ';
  };

  floatBtn.innerHTML = `
    <span class="floating-contact-label">Связаться</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  `;
  document.body.append(floatBtn);

  // === 3. СОЗДАЁМ МЕНЮ ===
  const panel = document.createElement('div');
  panel.className = 'contact-chooser';
  panel.id = 'contact-options';
  panel.setAttribute('role', 'dialog');
  panel.innerHTML = `
    <div class="contact-chooser-heading">СПОСОБЫ СВЯЗИ</div>
    <a href="https://t.me/thereallraff" target="_blank" rel="noopener noreferrer">
      <span class="contact-chooser-icon" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </span>
      <span class="contact-chooser-label"><strong>Telegram</strong><small>@thereallraff</small></span>
      <span class="contact-chooser-arrow" aria-hidden="true">↗</span>
    </a>
    <a href="https://www.linkedin.com/in/ravshanbekzoirov" target="_blank" rel="noopener noreferrer">
      <span class="contact-chooser-icon" aria-hidden="true">in</span>
      <span class="contact-chooser-label"><strong>LinkedIn</strong><small>ravshanbekzoirov</small></span>
      <span class="contact-chooser-arrow" aria-hidden="true">↗</span>
    </a>
    <a href="mailto:rafakodirov@gmail.com">
      <span class="contact-chooser-icon" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      </span>
      <span class="contact-chooser-label"><strong>Email</strong><small>rafakodirov@gmail.com</small></span>
      <span class="contact-chooser-arrow" aria-hidden="true">↗</span>
    </a>
  `;
  document.body.append(panel);

  // === 4. ЛОГИКА ПЛАВАЮЩЕГО МЕНЮ ===
  let open = false;

  const position = () => {
    const rect = floatBtn.getBoundingClientRect();
    const width = Math.min(316, window.innerWidth - 24);
    const panelHeight = panel.offsetHeight;
    let left = rect.left + (rect.width / 2) - (width / 2);
    left = Math.max(12, left);
    left = Math.min(left, window.innerWidth - width - 12);
    const top = Math.max(12, rect.top - panelHeight - 10);
    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
  };

  const setOpen = (next, restoreFocus = false) => {
    open = next;
    floatBtn.setAttribute('aria-expanded', String(next));
    panel.classList.toggle('is-open', next);
    if (next) {
      position();
      panel.querySelector('a')?.focus({ preventScroll: true });
    } else {
      if (restoreFocus) floatBtn.focus({ preventScroll: true });
    }
  };

  floatBtn.addEventListener('click', event => {
    event.preventDefault();
    setOpen(!open, open);
  });

  // === 5. ЗАКРЫТИЕ ПРИ ЛЮБОМ ВЗАИМОДЕЙСТВИИ СО СТРАНИЦЕЙ ===
  // Capture позволяет закрыть меню до обработчиков клика на элементах кейса.
  // При автоматическом закрытии не возвращаем фокус на плавающую кнопку:
  // это предотвращает неожиданные скачки страницы во время прокрутки.
  const closeMenu = () => { if (open) setOpen(false); };
  const outsideInteraction = event => {
    if (!open || panel.contains(event.target) || floatBtn.contains(event.target)) return;
    closeMenu();
  };
  document.addEventListener('pointerdown', outsideInteraction, true);
  document.addEventListener('click', outsideInteraction, true);
  window.addEventListener('scroll', closeMenu, { passive: true, capture: true });
  document.addEventListener('scroll', closeMenu, { passive: true, capture: true });
  window.addEventListener('wheel', closeMenu, { passive: true, capture: true });
  window.addEventListener('touchmove', closeMenu, { passive: true, capture: true });
  window.addEventListener('keydown', event => {
    if (!open) return;
    if (event.key === 'Escape') { setOpen(false, true); return; }
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) closeMenu();
  }, true);
  window.addEventListener('blur', closeMenu);

  // All case pages share this widget. Dismiss on any genuine page interaction,
  // including scrollable nested containers, touch gestures, and iframe activity.
  document.addEventListener('touchstart', event => {
    if (open && !panel.contains(event.target) && !floatBtn.contains(event.target)) closeMenu();
  }, { passive: true, capture: true });
  document.addEventListener('focusin', event => {
    if (open && !panel.contains(event.target) && !floatBtn.contains(event.target)) closeMenu();
  }, true);
  window.addEventListener('resize', closeMenu, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) closeMenu();
  });
  window.addEventListener('message', event => {
    if (event.source !== window && event.source !== window.parent && ![...document.querySelectorAll('iframe')].some(frame => frame.contentWindow === event.source)) return;
    if (event.data?.type === 'portfolio-contact-dismiss') closeMenu();
  });

  // A parent page cannot see scroll events inside an iframe. Relay them safely.
  if (window.parent !== window) {
    const relay = () => window.parent.postMessage({ type: 'portfolio-contact-dismiss' }, '*');
    window.addEventListener('scroll', relay, { passive: true, capture: true });
    document.addEventListener('pointerdown', relay, { passive: true, capture: true });
    window.addEventListener('wheel', relay, { passive: true, capture: true });
    window.addEventListener('touchmove', relay, { passive: true, capture: true });
  }


  // The homepage remains mounted underneath the iframe case overlay.
  // Hide ONLY its floating widget while a case is open: the iframe owns its
  // own floating widget. Otherwise two buttons overlap until page reload.
  if (window.parent === window && document.getElementById('detail')) {
    const syncCaseOverlay = () => {
      const inCase = document.body.classList.contains('detail-open');
      floatBtn.hidden = inCase;
      panel.hidden = inCase;
      if (inCase) closeMenu();
    };
    new MutationObserver(syncCaseOverlay).observe(document.body, {
      attributes: true, attributeFilter: ['class']
    });
    syncCaseOverlay();
  }

  // === 6. СИНХРОНИЗАЦИЯ ЯЗЫКА ===
  new MutationObserver(updateFloatBtnText).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  
  document.addEventListener('click', (event) => {
    if (event.target.closest('.travel-lang, .case-lang, .lang')) {
      setTimeout(updateFloatBtnText, 50); 
    }
  });

  const langBtn = document.querySelector('.travel-lang, .case-lang, .lang');
  if (langBtn) {
    new MutationObserver(updateFloatBtnText).observe(langBtn, { childList: true, characterData: true, subtree: true });
  }

  updateFloatBtnText(); 

  // === 7. SCROLL SPY ===
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

// Плавная прокрутка для якорей
(() => {
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest && event.target.closest('a[href^="#"]');
    if (!link) return;
    let id = link.getAttribute('href').slice(1);
    try { id = decodeURIComponent(id); } catch (e) {}
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });
})();