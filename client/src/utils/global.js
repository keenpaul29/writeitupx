// Polyfill for 'global' used by Draft.js
if (typeof global === 'undefined') {
  window.global = window;
}