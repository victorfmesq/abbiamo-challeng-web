import { storage } from '@/storage/storage';
import type { AuthUser } from '../types';

const USER_KEY = 'auth.user';

export const session = {
  getUser: (): AuthUser | null => {
    try {
      const user = storage.get(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
  setUser: (user: AuthUser) => {
    storage.set(USER_KEY, JSON.stringify(user));
  },
  clear: () => {
    storage.remove(USER_KEY);
  },
};
