import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from "@astrojs/sitemap";
import { VitePWA } from "vite-plugin-pwa"
// https://astro.build/config
export default defineConfig({
  adapter: netlify({
    edgeMiddleware: true
  }),
  output: 'server',
  site: 'https://colors.fyi',
  integrations: [sitemap()],
  vite: {
    // https://github.com/shaunchander/astro-pwa-starter/blob/master/astro.config.ts
		plugins: [
			VitePWA({
				registerType: "autoUpdate",
				workbox: {
				  globDirectory: 'dist',
				  globPatterns: [
				    '**/*.{js,css,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}',
				  ],
				  // Don't fallback on document based (e.g. `/some-page`) requests
				  // This removes an errant console.log message from showing up.
				  navigateFallback: null,
				},
			})
		]
	}
});