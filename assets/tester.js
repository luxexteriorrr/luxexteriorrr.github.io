// Type tester sizing for the typeface pages (zerko/, depo/). The size never lets the longest word run past the
// line, so no word breaks in the middle; the slider's top follows the room there is; and everything re-fits when
// the window changes, a font lands, the text is edited, or a style or script is switched. The size the visitor
// last asked for is kept, so it comes back when there is room again. Pasted text arrives as plain text.
function testerSizing(el, sample, min, max, start) {
  const input = el.querySelector('input[type=range]'), px = el.querySelector('.px');
  const ctx = document.createElement('canvas').getContext('2d');
  let wanted = start;
  const cap = () => {
    const cs = getComputedStyle(sample);
    const font = `${cs.fontStyle} ${cs.fontWeight} 100px ${cs.fontFamily}`;
    if (!document.fonts.check(font)) document.fonts.load(font).then(fit);   // measure again once that style is in
    ctx.font = font;
    const words = sample.textContent.split(/\s+/).filter(Boolean);
    const longest = Math.max(1, ...words.map(w => ctx.measureText(w).width));
    return Math.floor(100 * sample.clientWidth / longest * 0.98);
  };
  function fit() {
    const top = Math.max(min, Math.min(max, cap()));
    input.max = top;
    const size = Math.max(min, Math.min(wanted, top));
    input.value = size;
    sample.style.fontSize = size + 'px';
    px.textContent = size + ' px';
  }
  input.addEventListener('input', () => { wanted = +input.value; fit(); });
  sample.addEventListener('input', fit);
  sample.addEventListener('paste', e => {   // for browsers without contenteditable="plaintext-only"
    e.preventDefault();
    document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
  });
  addEventListener('resize', fit);
  document.fonts.ready.then(fit);
  return { fit };
}
