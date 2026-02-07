import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CatchAllRoute } from './AppRouter';
import { useAuth } from '@/features/auth/hooks/useAuth';

// Mock the useAuth hook
vi.mock('@/features/auth/hooks/useAuth');

describe('CatchAllRoute', () => {
  describe('When not authenticated', () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue({
        status: 'unauthenticated',
        isAuthenticated: false,
        user: null,
        signIn: vi.fn(),
        signOut: vi.fn(),
      });
    });

    it('redirects to /login for non-existent route', () => {
      render(
        <MemoryRouter initialEntries={['/non-existent-route']}>
          <Routes>
            <Route path='*' element={<CatchAllRoute />} />
            <Route path='/login' element={<div>Entre na sua conta</div>} />
          </Routes>
        </MemoryRouter>
      );

      // The component should redirect to /login
      expect(screen.getByText('Entre na sua conta')).toBeInTheDocument();
    });
  });

  describe('When authenticated', () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue({
        status: 'authenticated',
        isAuthenticated: true,
        user: { id: '1', name: 'Test', email: 'test@test.com', role: 'admin' },
        signIn: vi.fn(),
        signOut: vi.fn(),
      });
    });

    it('redirects to /dashboard for non-existent route', () => {
      render(
        <MemoryRouter initialEntries={['/non-existent-route']}>
          <Routes>
            <Route path='*' element={<CatchAllRoute />} />
            <Route path='/dashboard' element={<div>Dashboard</div>} />
          </Routes>
        </MemoryRouter>
      );

      // The component should redirect to /dashboard
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });
});
