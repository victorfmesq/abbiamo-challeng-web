import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import App from '@/App';
import * as httpClient from '@/services/httpClient';
import * as session from '@/features/auth/services/session';

// Setup mocks before importing components
vi.mock('@/services/httpClient', async () => {
  const actual = await vi.importActual('@/services/httpClient');
  return {
    ...actual,
    authStorage: {
      getToken: vi.fn(),
      setToken: vi.fn(),
      clear: vi.fn(),
    },
  };
});

vi.mock('@/features/auth/services/session', async () => {
  const actual = await vi.importActual('@/features/auth/services/session');
  return {
    ...actual,
    session: {
      getUser: vi.fn(),
      setUser: vi.fn(),
      clear: vi.fn(),
    },
  };
});

describe('App', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.restoreAllMocks();
    queryClient = new QueryClient();

    // Mock authStorage and session to return no authentication
    vi.spyOn(httpClient.authStorage, 'getToken').mockReturnValue(null);
    vi.spyOn(session.session, 'getUser').mockReturnValue(null);
  });

  it('renders without crashing', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    );

    // App should render something (either loading or login)
    expect(document.body).toBeInTheDocument();
  });
});
