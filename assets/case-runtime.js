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
    document.querySelectorAll('.portfolio-contact-label').forEach(el => {
      el.textContent = isEn ? 'Contact' : 'Связаться';
    });
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
  let activeTrigger = floatBtn;
  const topTrigger = document.querySelector('.portfolio-contact');
  for (const trigger of [floatBtn, topTrigger].filter(Boolean)) {
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', panel.id);
    trigger.setAttribute('aria-expanded', 'false');
  }
  panel.setAttribute('aria-hidden', 'true');
  panel.inert = true;

  const position = () => {
    const rect = activeTrigger.getBoundingClientRect();
    const width = panel.getBoundingClientRect().width;
    const panelHeight = panel.offsetHeight;
    let left = rect.left + (rect.width / 2) - (width / 2);
    left = Math.max(12, left);
    left = Math.min(left, window.innerWidth - width - 12);
    const desiredTop = activeTrigger === floatBtn ? rect.top - panelHeight - 10 : rect.bottom + 10;
    const top = Math.max(12, Math.min(desiredTop, window.innerHeight - panelHeight - 12));
    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
  };

  const setOpen = (next, restoreFocus = false) => {
    open = next;
    for (const trigger of [floatBtn, topTrigger].filter(Boolean)) {
      trigger.setAttribute('aria-expanded', String(next && trigger === activeTrigger));
    }
    panel.setAttribute('aria-hidden', String(!next));
    panel.inert = !next;
    panel.classList.toggle('is-open', next);
    if (next) {
      position();
      panel.querySelector('a')?.focus({ preventScroll: true });
    } else {
      if (restoreFocus) activeTrigger.focus({ preventScroll: true });
    }
  };

  floatBtn.addEventListener('click', event => {
    event.preventDefault();
    const next = !open || activeTrigger !== floatBtn;
    activeTrigger = floatBtn;
    setOpen(next, !next);
  });

  // Intercept legacy mailto handlers before they launch the mail application.
  window.addEventListener('click', event => {
    if (!topTrigger || !topTrigger.contains(event.target)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const next = !open || activeTrigger !== topTrigger;
    activeTrigger = topTrigger;
    setOpen(next, !next);
  }, true);
  topTrigger?.addEventListener('keydown', event => {
    if (event.key === ' ') { event.preventDefault(); topTrigger.click(); }
  });

  // === 5. ЗАКРЫТИЕ ПРИ ЛЮБОМ ВЗАИМОДЕЙСТВИИ СО СТРАНИЦЕЙ ===
  // Capture позволяет закрыть меню до обработчиков клика на элементах кейса.
  // При автоматическом закрытии не возвращаем фокус на плавающую кнопку:
  // это предотвращает неожиданные скачки страницы во время прокрутки.
  const closeMenu = () => { if (open) setOpen(false); };
  const outsideInteraction = event => {
    if (!open || panel.contains(event.target) || floatBtn.contains(event.target) || topTrigger?.contains(event.target)) return;
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
    if (event.key === 'Escape') { event.stopImmediatePropagation(); setOpen(false, true); return; }
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) closeMenu();
  }, true);
  window.addEventListener('blur', closeMenu);

  // All case pages share this widget. Dismiss on any genuine page interaction,
  // including scrollable nested containers, touch gestures, and iframe activity.
  document.addEventListener('touchstart', event => {
    if (open && !panel.contains(event.target) && !floatBtn.contains(event.target) && !topTrigger?.contains(event.target)) closeMenu();
  }, { passive: true, capture: true });
  document.addEventListener('focusin', event => {
    if (open && !panel.contains(event.target) && !floatBtn.contains(event.target) && !topTrigger?.contains(event.target)) closeMenu();
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

  // Anchor state is owned exclusively by project-navigation.js.
})();

// A shared language picker delegates translation to each page's existing engine.
(() => {
  if (window.__rzLanguagePickerLoaded) return;
  window.__rzLanguagePickerLoaded = true;
  const selector = '#language,.case-lang,.travel-lang,.mdr-lang';
  const triggers = [...document.querySelectorAll(selector)];
  if (!triggers.length) return;
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = 'assets/language-picker.css';
  document.head.append(stylesheet);
  const menu = document.createElement('div');
  menu.className = 'portfolio-language-menu';
  menu.id = 'portfolio-language-options';
  menu.setAttribute('role', 'menu');
  menu.hidden = true;
  menu.innerHTML = '<button type="button" role="menuitemradio" data-language="ru"><span>RU</span> Русский <span class="language-check" aria-hidden="true">✓</span></button><button type="button" role="menuitemradio" data-language="en"><span>EN</span> English <span class="language-check" aria-hidden="true">✓</span></button>';
  document.body.append(menu);
  const current = () => document.documentElement.lang.startsWith('en') ? 'en' : 'ru';
  let activeTrigger = triggers[0];
  const sync = () => {
    const lang = current();
    for (const trigger of triggers) {
      if (trigger.textContent !== lang.toUpperCase()) trigger.textContent = lang.toUpperCase();
      trigger.setAttribute('aria-label', lang === 'en' ? 'Choose language' : 'Выбрать язык');
      trigger.setAttribute('aria-haspopup', 'menu');
      trigger.setAttribute('aria-controls', menu.id);
      trigger.setAttribute('aria-expanded', String(!menu.hidden && trigger === activeTrigger));
    }
    menu.setAttribute('aria-label', lang === 'en' ? 'Language' : 'Язык');
    menu.querySelectorAll('[data-language]').forEach(button => {
      button.setAttribute('aria-checked', String(button.dataset.language === lang));
    });
  };
  const close = (restore = false) => {
    menu.hidden = true;
    sync();
    if (restore) activeTrigger.focus({preventScroll:true});
  };
  const open = trigger => {
    activeTrigger = trigger;
    menu.hidden = false;
    const r = trigger.getBoundingClientRect();
    menu.style.left = Math.max(12, Math.min(r.right - menu.offsetWidth, innerWidth - menu.offsetWidth - 12)) + 'px';
    menu.style.top = Math.max(12, Math.min(r.bottom + 10, innerHeight - menu.offsetHeight - 12)) + 'px';
    sync();
    menu.querySelector('[aria-checked="true"]').focus({preventScroll:true});
  };
  window.addEventListener('click', event => {
    const trigger = event.target.closest(selector);
    if (!trigger) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!menu.hidden && trigger === activeTrigger) close(true);
    else open(trigger);
  }, true);
  menu.addEventListener('click', event => {
    const option = event.target.closest('[data-language]');
    if (!option) return;
    const lang = option.dataset.language;
    close(true);
    try { localStorage.setItem('portfolio-lang', lang); } catch (_) {}
    // Existing handlers translate content, update URL state and notify the host.
    window.postMessage({type:'portfolio-language',lang}, '*');
    if (window.parent !== window) window.parent.postMessage({type:'portfolio-language',lang}, '*');
  });
  document.addEventListener('pointerdown', event => {
    if (!menu.hidden && !menu.contains(event.target) && !event.target.closest(selector)) close();
  }, true);
  window.addEventListener('keydown', event => {
    if (menu.hidden) {
      if (event.target.matches(selector) && ['ArrowDown','ArrowUp'].includes(event.key)) {
        event.preventDefault(); event.stopImmediatePropagation(); open(event.target);
      }
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault(); event.stopImmediatePropagation(); close(true);
    } else if (['ArrowDown','ArrowUp','Home','End'].includes(event.key)) {
      event.preventDefault(); event.stopImmediatePropagation();
      const options = [...menu.querySelectorAll('button')];
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (options.indexOf(document.activeElement) + (event.key === 'ArrowUp' ? -1 : 1) + options.length) % options.length;
      options[next].focus();
    } else if (event.key === 'Tab') close();
  }, true);
  window.addEventListener('scroll', () => close(), {passive:true,capture:true});
  window.addEventListener('resize', () => close(), {passive:true});
  new MutationObserver(sync).observe(document.documentElement, {attributes:true,attributeFilter:['lang']});
  for (const trigger of triggers) new MutationObserver(sync).observe(trigger, {childList:true,characterData:true,subtree:true});
  sync();
  // The homepage's initial stored language must also render its translated content.
  if (document.getElementById('language') && typeof updateLang === 'function') updateLang();
  if (window.__portfolioInitialLanguage) {
    // Deliver after all deferred case translators have registered their listeners.
    window.postMessage({type:'portfolio-language',lang:window.__portfolioInitialLanguage}, '*');
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
