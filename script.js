const button = document.getElementById('langToggle');
const requestedLang = new URLSearchParams(window.location.search).get('lang');
let lang = requestedLang === 'ja' || requestedLang === 'en' ? requestedLang : (localStorage.getItem('knitmark-lang') || 'ja');

function applyLanguage() {
  document.documentElement.lang = lang;
  const titleJa = document.body?.dataset.titleJa || 'Knit Mark | 編み物カウンター';
  const titleEn = document.body?.dataset.titleEn || 'Knit Mark | Knitting Counter';
  document.title = lang === 'ja' ? titleJa : titleEn;
  document.querySelectorAll('[data-ja][data-en]').forEach((el) => {
    el.innerHTML = el.dataset[lang];
  });
  document.querySelectorAll('[data-ja-href][data-en-href]').forEach((el) => {
    el.href = lang === 'ja' ? el.dataset.jaHref : el.dataset.enHref;
  });
  document.querySelectorAll('[data-ja-src][data-en-src]').forEach((el) => {
    el.src = lang === 'ja' ? el.dataset.jaSrc : el.dataset.enSrc;
  });
  if (button) { button.dataset.lang = lang; button.setAttribute('aria-pressed', lang === 'en' ? 'true' : 'false'); }
  localStorage.setItem('knitmark-lang', lang);
}

button?.addEventListener('click', () => {
  lang = lang === 'ja' ? 'en' : 'ja';
  const url = new URL(window.location.href);
  url.searchParams.delete('lang');
  window.history.replaceState(null, '', url);
  applyLanguage();
});

applyLanguage();
