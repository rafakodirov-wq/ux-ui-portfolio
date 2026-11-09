/* Keep the three-tile layout while cycling through the whole moodboard. */
(() => {
  const root = document.querySelector('.dd-system-mood');
  if (!root) return;

  const gallery = root.querySelector('.dd-mood-gallery');
  const groups = [...gallery.querySelectorAll('.dd-mood-grid')];
  const dots = [...root.querySelectorAll('.lato-dot')];
  const viewer = document.querySelector('#dd-media-viewer');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const slidesPerGroup = 3;
  const slideCount = groups.length * slidesPerGroup;
  let index = 0;
  let timer;
  let finishTransition;
  let nearViewport = false;

  function preloadNeighbors(groupIndex) {
    for (const offset of [-1, 0, 1]) {
      const neighbor = groups[(groupIndex + offset + groups.length) % groups.length];
      neighbor.querySelectorAll('img[loading="lazy"]').forEach(image => { image.loading = 'eager'; });
    }
  }

  function go(nextIndex, direction = Math.sign(nextIndex - index)) {
    const previous = groups[Math.floor(index / slidesPerGroup)];
    index = (nextIndex + slideCount) % slideCount;
    const groupIndex = Math.floor(index / slidesPerGroup);
    const current = groups[groupIndex];
    const focus = index % slidesPerGroup;

    if (current !== previous) finishTransition?.();
    current.dataset.moodFocus = String(focus);
    [...current.children].forEach((slide, i) => slide.classList.toggle('is-current', i === focus));
    current.hidden = false;
    dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === groupIndex)));
    if (nearViewport) preloadNeighbors(groupIndex);
    if (current === previous) return;

    if (reducedMotion.matches) {
      previous.hidden = true;
      return;
    }

    previous.classList.add('is-leaving');
    previous.inert = true;
    current.classList.add('is-entering');
    const timing = { duration: 540, easing: 'cubic-bezier(.22,.68,.27,1)' };
    const outgoing = previous.animate([
      { opacity: 1, transform: 'translateX(0)' },
      { opacity: .1, transform: `translateX(${-direction * 10}px)` }
    ], timing);
    const incoming = current.animate([
      { opacity: 0, transform: `translateX(${direction * 14}px)` },
      { opacity: 1, transform: 'translateX(0)' }
    ], timing);
    finishTransition = () => {
      outgoing.cancel();
      incoming.cancel();
      previous.hidden = true;
      previous.inert = false;
      previous.classList.remove('is-leaving');
      current.classList.remove('is-entering');
      finishTransition = undefined;
    };
    incoming.onfinish = finishTransition;
  }

  function pause() {
    clearInterval(timer);
  }

  function play() {
    pause();
    if (reducedMotion.matches || document.hidden || viewer?.open || gallery.contains(document.activeElement)) return;
    timer = setInterval(() => go(index + 1), 3000);
  }

  function select(nextIndex) {
    go(nextIndex);
    play();
  }

  root.querySelector('.lato-prev').addEventListener('click', () => select(index - 1));
  root.querySelector('.lato-next').addEventListener('click', () => select(index + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => select(i * slidesPerGroup)));

  gallery.addEventListener('focusin', pause);
  gallery.addEventListener('focusout', event => {
    if (!gallery.contains(event.relatedTarget)) queueMicrotask(play);
  });
  document.addEventListener('visibilitychange', play);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) finishTransition?.();
    play();
  });
  if (viewer) new MutationObserver(play).observe(viewer, { attributes: true, attributeFilter: ['open'] });

  new IntersectionObserver(([entry], observer) => {
    if (!entry.isIntersecting) return;
    nearViewport = true;
    preloadNeighbors(Math.floor(index / slidesPerGroup));
    observer.disconnect();
  }, { rootMargin: '250px' }).observe(gallery);

  go(0);
  play();
})();
