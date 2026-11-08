/* Shared final footer. Scrolling matches X’FLOW GYM v195 exactly. */
(() => {
  const footer = document.getElementById('rz-site-footer');
  if (!footer || footer.dataset.footerReady) return;
  footer.dataset.footerReady = 'true';
  const button = footer.querySelector('.portfolio-top-btn');
  const label = button.querySelector('span');
  function localize() {
    const text = document.documentElement.lang.toLowerCase().startsWith('en') ? 'Back to top' : 'Наверх';
    if (label.textContent !== text) label.textContent = text;
  }
  // One action even when a case retains an older direct button listener.
  window.addEventListener('click', event => {
    if (!event.target.closest?.('#rz-site-footer .portfolio-top-btn')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    scrollTo({top:0,behavior:'smooth'});
  }, true);
  new MutationObserver(localize).observe(document.documentElement, {attributes:true,attributeFilter:['lang']});
  localize();

  // Some cases position the floating contact button over the footer chevron.
  // Lift only that control while the footer action is in view; restore its
  // original CSS position when leaving the footer. Footer geometry stays exact.
  let clearanceInitialized = false;
  function initContactClearance() {
    if (clearanceInitialized) return;
    const contact = document.querySelector('body > .floating-contact');
    if (!contact) return;
    clearanceInitialized = true;
    let frame = 0;
    let originalBottom;
    function clear() {
      delete footer.dataset.contactClearance;
      contact.style.removeProperty('--footer-contact-bottom');
    }
    function clearance() {
      frame = 0;
      const action = button.getBoundingClientRect();
      const floating = contact.getBoundingClientRect();
      if (contact.hidden || action.top >= innerHeight || action.bottom <= 0 ||
          floating.right <= action.left || floating.left >= action.right) {
        clear();
        return;
      }
      if (!footer.hasAttribute('data-contact-clearance')) originalBottom = parseFloat(getComputedStyle(contact).bottom) || 0;
      const needed = innerHeight - action.top + 10;
      if (needed <= originalBottom) { clear(); return; }
      const value = Math.ceil(needed) + 'px';
      if (contact.style.getPropertyValue('--footer-contact-bottom') !== value) contact.style.setProperty('--footer-contact-bottom', value);
      footer.dataset.contactClearance = '';
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(clearance); }
    window.addEventListener('scroll', schedule, {passive:true});
    window.addEventListener('resize', () => { clear(); schedule(); }, {passive:true});
    new IntersectionObserver(schedule).observe(footer);
    new ResizeObserver(schedule).observe(document.body);
    new MutationObserver(schedule).observe(contact, {attributes:true,attributeFilter:['hidden']});
    schedule();
  }
  initContactClearance();
  // A few v195 pages load their contact runtime later in the document.
  window.addEventListener('DOMContentLoaded', initContactClearance, {once:true});
})();
