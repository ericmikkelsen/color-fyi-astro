import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify/static';

export default defineConfig({
  output: 'hybrid',
  adapter: netlify({
    cacheOnDemandPages: true,
  }),
});