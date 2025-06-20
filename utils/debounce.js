/**
 * Debounce utility
 * @param {Function} fn
 * @param {number} wait
 */
export function debounce(fn, wait) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}
