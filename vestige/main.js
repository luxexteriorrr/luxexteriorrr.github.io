// Vestige — the fade.
// Carried over from the 2025 version: after a stretch with no input, the visible
// `.decay` elements fade out one by one in random order; any input brings them back.
// Settings live in the URL hash so a look can be shared; press D for the panel.

const DEFAULTS = {
  unit: 'word',      // paragraph | sentence | word — what fades as one piece
  idle: 2000,        // ms of no input before the fade starts
  out: 1000,         // ms each piece takes to fade out
  gap: 100,          // ms pause before the next piece starts fading (2025 used 1000 per paragraph)
  back: 500,         // ms each piece takes to come back
  restore: 'all',    // all = back at once on any input; one = one by one (as in 2025, paragraph mode)
};

// Layout trials (28 Sep): ?layout=a sets the essay flush left in its own case; ?layout=b is A with the
// walk photos in the text as small tokens (see style.css; &token=square for black squares instead).
// Set first, so the media track is placed against the trial's text and the tokens are in the text
// before it is split for the fade (they fade like a word).
// &type=big sets the text large and justified across a wide column, as limits.ho.ldin.gs does.
const layout = new URLSearchParams(location.search).get('layout');
if (layout === 'a' || layout === 'b') document.documentElement.classList.add('layout-a');
if (new URLSearchParams(location.search).get('type') === 'big') document.documentElement.classList.add('type-big');
if (layout === 'b') {
  document.documentElement.classList.add('layout-b');
  const square = new URLSearchParams(location.search).get('token') === 'square';
  const token = (src, label, ratio = '3 / 4') => ` <span class="walk-token unit${square ? ' square' : ''}" role="button"`
    + ` tabindex="0" style="--r: ${(Math.random() * 16 - 8).toFixed(1)}deg; --ratio: ${ratio}; --k: calc(${ratio})" aria-label="${label}">`
    + `<img src="${src}" alt=""></span>`;
  const photos = [...document.querySelectorAll('.scene .photo img')].map(img => img.getAttribute('src'));
  ['#walk-start', '#d1 a', '#d2 a', '#d3 a', '#d4 a', '#d5 a'].forEach((sel, i) => {
    const host = document.querySelector(sel);
    if (!host || !photos[i]) return;
    const caption = host.textContent.replace(/^WALK\s*/, '').trim();
    host.insertAdjacentHTML('beforeend', token(photos[i], 'Photo from the walk, ' + caption));
  });
  // other images placed in the text by hand: <span class="inline-img" data-src data-ratio data-label>
  document.querySelectorAll('.inline-img').forEach(el => {
    el.outerHTML = token(el.dataset.src, el.dataset.label, el.dataset.ratio);
  });
  // the pondcam leaves the back of the page and sits in the text as well, live, at "a camera pointed at a pond"
  const stream = document.querySelector('.media.stream iframe'), at = document.querySelector('.inline-embed');
  if (stream && at) {
    at.outerHTML = ` <span class="walk-token embed unit" role="button" tabindex="0" style="--r: ${(Math.random() * 16 - 8).toFixed(1)}deg;`
      + ` --ratio: 16 / 9; --k: calc(16 / 9)" aria-label="Live pondcam, Hampstead Heath"><iframe src="${stream.getAttribute('src')}"`
      + ` title="${stream.title}" allow="autoplay; encrypted-media" tabindex="-1"></iframe></span>`;
    stream.closest('.scene').remove();
  }
  // click (or tap) a token and its photo grows where it is, in the line, pushing the text apart; again to close
  document.addEventListener('click', e => {
    const t = e.target.closest('.walk-token');
    if (!t) return;
    e.preventDefault(); // a token inside a date doesn't follow the date's link
    t.classList.toggle('open');
  });
}

const settings = { ...DEFAULTS };
const params = new URLSearchParams(location.hash.slice(1));
for (const key of Object.keys(DEFAULTS)) {
  if (!params.has(key)) continue;
  settings[key] = typeof DEFAULTS[key] === 'number' ? Number(params.get(key)) : params.get(key);
}

const originals = new Map(); // decay element -> original HTML, so units can be re-split

// Split each `.decay` block into the pieces that fade.
function splitUnits() {
  document.querySelectorAll('.decay').forEach(block => {
    if (!originals.has(block)) originals.set(block, block.innerHTML);
    block.innerHTML = originals.get(block);
    if (settings.unit === 'paragraph' || block.tagName === 'FIGURE' || block.classList.contains('sq')) {
      block.classList.add('unit');
      return;
    }
    block.classList.remove('unit');
    splitText(block);
  });
}

// Wrap each word (or sentence) of every text node in a span, leaving elements
// such as the relief link in place around their own words.
function splitText(el) {
  for (const node of [...el.childNodes]) {
    if (node.nodeType === Node.ELEMENT_NODE) { splitText(node); continue; }
    if (node.nodeType !== Node.TEXT_NODE) continue;
    const text = node.textContent;
    const pieces = settings.unit === 'word'
      ? text.split(/(\s+)/)
      : text.match(/[^.!?]+[.!?]*\s*/g) || [text];
    const frag = document.createDocumentFragment();
    for (const piece of pieces) {
      if (!piece) continue;
      if (/^\s+$/.test(piece)) { frag.append(piece); continue; }
      const span = document.createElement('span');
      span.className = 'unit';
      span.textContent = piece;
      frag.append(span);
    }
    node.replaceWith(frag);
  }
}

// Only what's on screen fades; measured at the moment the fade starts.
function onScreen(unit) {
  const r = unit.getBoundingClientRect();
  return r.bottom > 0 && r.top < innerHeight && r.width > 0;
}

let idleTimer, stepTimer, fading = false;

function fadeOut() {
  fading = true;
  const queue = shuffle([...document.querySelectorAll('.unit')].filter(u => u.style.opacity !== '0' && onScreen(u)));
  const next = () => {
    if (!fading || !queue.length) return;
    const unit = queue.shift();
    unit.style.transition = `opacity ${settings.out}ms linear`;
    unit.style.opacity = '0';
    stepTimer = setTimeout(next, settings.out + settings.gap);
  };
  stepTimer = setTimeout(next, settings.gap);
}

function restore() {
  fading = false;
  clearTimeout(stepTimer);
  const faded = [...document.querySelectorAll('.unit')].filter(u => u.style.opacity === '0');
  if (settings.restore === 'all') {
    faded.forEach(u => { u.style.transition = `opacity ${settings.back}ms linear`; u.style.opacity = '1'; });
    return;
  }
  // One by one, like 2025: visible pieces first, the rest quietly.
  const seen = faded.filter(onScreen);
  faded.filter(u => !onScreen(u)).forEach(u => { u.style.transition = 'none'; u.style.opacity = '1'; });
  seen.forEach((u, i) => {
    u.style.transition = `opacity ${settings.back}ms linear ${i * settings.back}ms`;
    u.style.opacity = '1';
  });
}

function activity(e) {
  if (e?.target?.closest?.('#panel')) return;
  clearTimeout(idleTimer);
  if (fading || document.querySelector('.unit[style*="opacity: 0"]')) restore();
  idleTimer = setTimeout(fadeOut, settings.idle);
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// --- panel (press D) ---------------------------------------------------------
function buildPanel() {
  const panel = document.getElementById('panel');
  const field = (key, label, input) => `<label><span>${label}</span>${input}</label>`;
  const number = (key, label, step) => field(key, label, `<input type="number" data-key="${key}" min="0" step="${step}" value="${settings[key]}">`);
  const select = (key, label, options) => field(key, label,
    `<select data-key="${key}">${options.map(o => `<option${o === settings[key] ? ' selected' : ''}>${o}</option>`).join('')}</select>`);
  panel.innerHTML = `
    <p>fade · press D to hide</p>
    ${select('unit', 'fades as', ['paragraph', 'sentence', 'word'])}
    ${number('idle', 'idle before fade (ms)', 250)}
    ${number('out', 'fade-out length (ms)', 100)}
    ${number('gap', 'pause between pieces (ms)', 100)}
    ${number('back', 'come-back length (ms)', 100)}
    ${select('restore', 'comes back', ['all', 'one'])}
    <button type="button" data-reset>reset to defaults</button>`;
}
function wirePanel() {
  const panel = document.getElementById('panel');
  panel.addEventListener('change', e => {
    const key = e.target.dataset.key;
    if (!key) return;
    settings[key] = typeof DEFAULTS[key] === 'number' ? Number(e.target.value) : e.target.value;
    saveHash();
    if (key === 'unit') { restore(); splitUnits(); }
  });
  panel.addEventListener('click', e => {
    if (!e.target.matches('[data-reset]')) return;
    Object.assign(settings, DEFAULTS); saveHash(); buildPanel(); restore(); splitUnits();
  });
}
function saveHash() {
  const changed = Object.keys(DEFAULTS).filter(k => settings[k] !== DEFAULTS[k]);
  history.replaceState(null, '', changed.length ? '#' + changed.map(k => `${k}=${settings[k]}`).join('&') : location.pathname);
}

document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'd' && !e.target.closest('#panel')) document.getElementById('panel').toggleAttribute('hidden');
});
['scroll', 'mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel'].forEach(type =>
  addEventListener(type, activity, { passive: true }));

splitUnits();
buildPanel();
wirePanel();
activity();

// Citations: clicking a number shows the full reference under its paragraph (taken from the
// bibliography at the end); clicking again hides it.
document.addEventListener('click', e => {
  const cite = e.target.closest('.cite');
  if (!cite) return;
  const para = cite.closest('p');
  const open = para.nextElementSibling?.matches(`.fn[data-fn="${cite.dataset.fn}"]`) ? para.nextElementSibling : null;
  if (open) { open.remove(); cite.setAttribute('aria-expanded', 'false'); return; }
  const fn = document.createElement('span');
  fn.className = 'fn'; fn.dataset.fn = cite.dataset.fn; fn.setAttribute('role', 'note');
  fn.innerHTML = document.getElementById('bib-' + cite.dataset.fn).innerHTML;
  para.after(fn);
  cite.setAttribute('aria-expanded', 'true');
});

// Drifting squares: each one wanders slowly, turning a little at a time, and wraps at the edges.
// Still for anyone who has asked for reduced motion.
(() => {
  const squares = [...document.querySelectorAll('.drift .sq')];
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const state = squares.map(() => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    a: Math.random() * Math.PI * 2, v: 6 + Math.random() * 10 }));
  const place = () => squares.forEach((p, i) => { p.style.transform = `translate(${state[i].x}px, ${state[i].y}px)`; });
  place();
  if (still) return;
  let last = performance.now();
  requestAnimationFrame(function step(now) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    state.forEach(s => {
      s.a += (Math.random() - 0.5) * 0.6 * dt * 10 * 0.1;
      s.x += Math.cos(s.a) * s.v * dt; s.y += Math.sin(s.a) * s.v * dt;
      if (s.x < -10) s.x = innerWidth; if (s.x > innerWidth) s.x = -10;
      if (s.y < -10) s.y = innerHeight; if (s.y > innerHeight) s.y = -10;
    });
    place();
    requestAnimationFrame(step);
  });
})();

// Media track: place each scene between its two markers in the text (document coordinates).
(() => {
  const track = document.querySelector('.track');
  const top = el => el.getBoundingClientRect().top + scrollY;
  function layout() {
    track.querySelectorAll('.scene').forEach(scene => {
      const start = scene.dataset.start === 'top' ? 0 : top(document.querySelector(scene.dataset.start));
      const end = top(document.querySelector(scene.dataset.end));
      scene.style.top = start + 'px';
      scene.style.height = Math.max(0, end - start) + 'px';
    });
  }
  layout();
  addEventListener('resize', layout);
  addEventListener('load', layout);
  document.fonts?.ready.then(layout);
})();

// Walks as a wipe (trying, 28 Sep): ?walks=wipe (full screen) or ?walks=frame (3:4 frame).
// While a photo's scene rises into view, the photo starts lower and settles as the edge reaches the top,
// so it comes in slower than the page. &shift= sets how much lower, as a share of the screen (0 = no drift).
(() => {
  const query = new URLSearchParams(location.search);
  const mode = query.get('walks');
  if (mode !== 'wipe' && mode !== 'frame') return;
  document.documentElement.classList.add('walks-' + mode);
  const shift = Number(query.get('shift') ?? 0.5);
  // &size= sets the frame's height as a share of the screen height (the default is 80, capped by the width)
  if (query.has('size')) document.documentElement.style.setProperty('--photo-h',
    `min(${Number(query.get('size'))}vh, calc((100vw - 32px) * 4 / 3))`);
  const scenes = [...document.querySelectorAll('.scene')].filter(s => s.querySelector('.photo'));
  function drift() {
    scenes.forEach(scene => {
      const p = Math.min(1, Math.max(0, scene.getBoundingClientRect().top / innerHeight));
      scene.querySelector('.photo').style.setProperty('--shift', (p * shift * innerHeight).toFixed(1) + 'px');
    });
  }
  drift();
  addEventListener('scroll', drift, { passive: true });
  addEventListener('resize', drift);
})();
