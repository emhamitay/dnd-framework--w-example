import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ['react', 'react-dom', 'zustand'],
      alias: {
        '@lib': path.resolve(__dirname, '../src'),
      },
      // Allow resolving dependencies from parent directory
      preserveSymlinks: false,
    },
    // Optimize dependencies resolution
    optimizeDeps: {
      include: ['zustand'],
    },
  },
  site: 'https://emhamitay.github.io',
  base: '/ghostdrop/',
});
