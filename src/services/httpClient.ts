import { storage } from '@/storage/storage';
import { createHttpClient } from './helpers';

const TOKEN_KEY = 'auth.token';

export const authStorage = {
  getToken: () => storage.get(TOKEN_KEY),
  setToken: (token: string) => storage.set(TOKEN_KEY, token),
  clear: () => storage.remove(TOKEN_KEY),
};

const api = createHttpClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  getToken: authStorage.getToken,
});

export default api;
