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
    if (settings.unit === 'paragraph' || block.tagName === 'FIGURE') {
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
