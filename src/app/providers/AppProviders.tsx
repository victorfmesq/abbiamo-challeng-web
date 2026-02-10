import type { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '@/app/config/queryClient';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position='top-right'
        toastOptions={{
          duration: 4000,
          style: { background: '#0f172a', color: '#e2e8f0', border: '1px solid #334155' },
        }}
      />
    </QueryClientProvider>
  );
}
