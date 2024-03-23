import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify/functions';

export default defineConfig({
  adapter: netlify({
    edgeMiddleware: true,
  }),
  output: 'server',
  site: 'https://colors.fyi',
});