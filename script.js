const button = document.getElementById('langToggle');
let lang = localStorage.getItem('knitmark-lang') || 'ja';

function applyLanguage() {
  document.documentElement.lang = lang;
  document.title = lang === 'ja' ? 'Knit Mark | 編み物カウンター' : 'Knit Mark | Knitting Counter';
  document.querySelectorAll('[data-ja][data-en]').forEach((el) => {
    el.innerHTML = el.dataset[lang];
  });
  document.querySelectorAll('[data-ja-href][data-en-href]').forEach((el) => {
    el.href = lang === 'ja' ? el.dataset.jaHref : el.dataset.enHref;
  });
  if (button) { button.dataset.lang = lang; button.setAttribute('aria-pressed', lang === 'en' ? 'true' : 'false'); }
  localStorage.setItem('knitmark-lang', lang);
}

button?.addEventListener('click', () => {
  lang = lang === 'ja' ? 'en' : 'ja';
  applyLanguage();
});

applyLanguage();

const revealTargets = [
  ...document.querySelectorAll('.section-heading'),
  ...document.querySelectorAll('.feature-card'),
  ...document.querySelectorAll('.device-showcase'),
  ...document.querySelectorAll('.download-section'),
  ...document.querySelectorAll('footer')
];

revealTargets.forEach((el) => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, {
    threshold: 0.14,
    rootMargin: '0px 0px -8% 0px'
  });

  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
}
