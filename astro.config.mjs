import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify/functions';

export default defineConfig({
  site: 'https://colors.fyi',
  output: 'server',
  adapter: netlify({
    edgeMiddleware: true,
  }),
  vite: {
    ssr: {
      external: ['sharp', 'color','detect-libc','semver'],
    }
  }
});