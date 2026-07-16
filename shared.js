// Shared JS for all pages

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const links = document.querySelector('.links');
  if (hamburger && links) {
    hamburger.addEventListener('click', () => links.classList.toggle('open'));
    // Close menu on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }
});

// Lightbox
function initLightbox(images) {
  const lb = document.getElementById('lightbox');
  if (!lb || !images.length) return;
  const lbImg = lb.querySelector('img');
  let currentIdx = 0;

  function open(idx) {
    currentIdx = idx;
    lbImg.src = images[idx];
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }
  function prev() {
    currentIdx = (currentIdx - 1 + images.length) % images.length;
    lbImg.src = images[currentIdx];
  }
  function next() {
    currentIdx = (currentIdx + 1) % images.length;
    lbImg.src = images[currentIdx];
  }

  lb.querySelector('.lightbox-close').addEventListener('click', close);
  lb.querySelector('.lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); prev(); });
  lb.querySelector('.lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); next(); });
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  return open;
}

// Build image grid from array of {src, alt} objects
function buildGrid(containerId, images, openFn) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  images.forEach((img, i) => {
    const div = document.createElement('div');
    div.className = 'grid-item';
    div.innerHTML = `<img src="${img.src}" alt="${img.alt || ''}" loading="lazy">`;
    div.addEventListener('click', () => openFn(i));
    grid.appendChild(div);
  });
}

// ===== Bilingual toggle (EN/FR) =====
// Page prose carries both languages inline via .x-en / .x-fr (hidden/shown by CSS).
// Here we only handle the SHARED chrome (nav + footer labels) + the toggle control,
// so individual pages never need their nav edited.
//
// The inline <head> script is the source of truth for the initial language: it runs
// before first paint (so there is no flash of the wrong language), resolving a stored
// choice first and otherwise falling back to the browser's own language preference.
// We read the result off <html lang> rather than re-deriving it here, so the detection
// rule lives in exactly one place.
(function () {
  var FR = {
    'Digital Architecture': 'Architecture numérique',
    'Curations': 'Commissariat',
    'About': 'À propos',
    'Photography': 'Photographie',
    'Email': 'Courriel',
    'About & Contact': 'À propos et contact'
  };
  var LABEL = {
    en: 'Voir ce site en français',
    fr: 'View this site in English'
  };
  function getLang() { return document.documentElement.lang === 'fr' ? 'fr' : 'en'; }
  function store(l) { try { localStorage.setItem('siteLang', l); } catch (e) {} }
  function swapChrome(lang) {
    document.querySelectorAll('nav .links a, .site-footer .footer-links a, .footer-links a').forEach(function (a) {
      if (!a.dataset.en) a.dataset.en = a.textContent.trim();
      var fr = FR[a.dataset.en];
      if (fr) a.textContent = (lang === 'fr') ? fr : a.dataset.en;
    });
  }
  function apply(lang) {
    document.documentElement.lang = lang;
    swapChrome(lang);
    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      var on = b.dataset.set === lang;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  function inject() {
    var nav = document.querySelector('nav');
    if (!nav || nav.querySelector('.lang-switch')) return;
    var s = document.createElement('div');
    s.className = 'lang-switch';
    // Sits in the nav bar itself, not inside .links — .links collapses behind the
    // hamburger on mobile, which would bury the switch exactly where a francophone
    // visitor is least likely to hunt for it.
    s.innerHTML = '<button data-set="en" title="' + LABEL.fr + '">EN</button>' +
                  '<span class="sep" aria-hidden="true">/</span>' +
                  '<button data-set="fr" title="' + LABEL.en + '">FR</button>';
    s.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { store(b.dataset.set); apply(b.dataset.set); });
    });
    nav.appendChild(s);
  }
  document.addEventListener('DOMContentLoaded', function () { inject(); apply(getLang()); });
})();
