/* ================================================================
   Storage — localStorage 封装
   ================================================================ */
const Storage = {
  _prefix: 'accordion_',

  _key(name) {
    return this._prefix + name;
  },

  set(key, value) {
    try {
      localStorage.setItem(this._key(key), JSON.stringify(value));
    } catch (e) {
      // localStorage 满了，静默失败
      console.warn('Storage.set failed:', e.message);
    }
  },

  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(this._key(key));
      return raw !== null ? JSON.parse(raw) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(this._key(key));
    } catch (e) { /* noop */ }
  },

  clear() {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(this._prefix));
      keys.forEach(k => localStorage.removeItem(k));
    } catch (e) { /* noop */ }
  },
};
