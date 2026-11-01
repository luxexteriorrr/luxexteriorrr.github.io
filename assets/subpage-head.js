// The header on pages outside index.html (see subpage-head.css). Back returns to where you came from on the
// site, or home; Invert flips light and dark and remembers it, as on the site (localStorage 'theme').
(() => {
  const back = document.querySelector('.shead [data-back]');
  back?.addEventListener('click', e => {
    if (document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1) {
      e.preventDefault(); history.back();
    }
  });
  const flip = document.querySelector('.shead [data-theme-flip]');
  const sysDark = matchMedia('(prefers-color-scheme: dark)');
  const current = () => document.documentElement.dataset.theme || (sysDark.matches ? 'dark' : 'light');
  const mark = () => flip?.setAttribute('aria-pressed', current() === 'dark');
  flip?.addEventListener('click', () => {
    const t = current() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('theme', t); } catch (e) {}
    mark();
  });
  sysDark.addEventListener('change', mark);
  mark();
})();
