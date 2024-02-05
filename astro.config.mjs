import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify/static';

export default defineConfig({
  adapter: netlify({
    cacheOnDemandPages: true,
  }),
});