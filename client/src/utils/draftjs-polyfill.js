if (typeof window !== 'undefined' && !window.global) {
  window.global = window;
  window.process = { env: {} };
}