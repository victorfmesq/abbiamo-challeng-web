import { createContext, useCallback, useContext, useState, type PropsWithChildren } from 'react';
import type { AuthUser, LoginDto } from '../types';
import { login } from '../services/authService';
import { authStorage } from '@/services/httpClient';
import { session } from '../services/session';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

type AuthContextValue = {
  status: AuthStatus;
  isAuthenticated: boolean;
  user: AuthUser | null;
  signIn: (dto: LoginDto) => Promise<void>;
  signOut: () => void;
};

const getInitialAuth = (): { status: AuthStatus; user: AuthUser | null } => {
  try {
    const token = authStorage.getToken();
    const savedUser = session.getUser();

    if (token && savedUser) {
      return { status: 'authenticated', user: savedUser };
    }

    return { status: 'unauthenticated', user: null };
  } catch {
    return { status: 'unauthenticated', user: null };
  }
};

const initialAuth = getInitialAuth();

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AuthStatus>(initialAuth.status);
  const [user, setUser] = useState<AuthUser | null>(initialAuth.user);

  const signIn = useCallback(async (dto: LoginDto) => {
    const response = await login(dto);
    authStorage.setToken(response.token);
    session.setUser(response.user);
    setUser(response.user);
    setStatus('authenticated');
  }, []);

  const signOut = useCallback(() => {
    authStorage.clear();
    session.clear();
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const value: AuthContextValue = {
    status,
    isAuthenticated: status === 'authenticated',
    user,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
