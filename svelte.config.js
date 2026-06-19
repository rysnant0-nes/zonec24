import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	onwarn: (warning, handler) => {
		if (warning.code.startsWith('a11y_')) return;
		handler(warning);
	},
	kit: {
		adapter: adapter({
			pages: 'dist',
			assets: 'dist',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		paths: {
			base: process.env.BASE_URL || ''
		},
		files: {
			assets: 'public'
		},
		prerender: {
			handleHttpError: 'warn'
		}
	}
};

export default config;
