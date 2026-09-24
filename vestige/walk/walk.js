// Back to Vestige: go back in history when we came from the essay, so the reader
// lands where they were in the scroll; otherwise follow the link.
document.querySelector('.back').addEventListener('click', e => {
  if (document.referrer.startsWith(location.origin) && history.length > 1) { e.preventDefault(); history.back(); }
});
