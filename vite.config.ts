import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: '**/*.svg',
      svgrOptions: { icon: true, exportType: 'default' },
    }),
  ],
  server: {
    open: true,
    port: 6999,
    allowedHosts: ['96d7-2001-ee0-4b4d-130-c8a3-d73b-fdda-cb39.ngrok-free.app'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests',
    mockReset: true,
  },
});
