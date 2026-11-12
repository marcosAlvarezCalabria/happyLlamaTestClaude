import { defineConfig } from 'astro/config';

// Sitio 100 % estático: `astro build` genera dist/ y se arrastra a Netlify Drop.
export default defineConfig({
  output: 'static',
  server: { port: 4321 },
});
