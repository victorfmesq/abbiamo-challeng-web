export const storage = {
  get(key: string) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // empty
    }
  },
  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {
      // empty
    }
  },
};
