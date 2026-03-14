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
