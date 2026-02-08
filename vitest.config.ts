import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    // Disable watch mode to prevent file change interference
    watch: false,
    // Handle unhandled errors gracefully
    onUnhandledError: (error) => {
      // Ignore cancellation errors during test cleanup
      if (error.message === 'Cancelled') {
        console.warn('[Vitest] Test run cancelled (expected during cleanup)');
        return;
      }
      throw error;
    },
  },
});
