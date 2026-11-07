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
  button.textContent = lang === 'ja' ? 'EN' : '日本語';
  localStorage.setItem('knitmark-lang', lang);
}

button.addEventListener('click', () => {
  lang = lang === 'ja' ? 'en' : 'ja';
  applyLanguage();
});

applyLanguage();
