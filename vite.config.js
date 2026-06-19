import { sveltekit } from '@sveltejs/kit/vite';

const config = {
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/api/pddikti': {
				target: 'https://pddikti.fastapicloud.dev/api',
				changeOrigin: true,
				rewrite: (p) => p.replace(/^\/api\/pddikti/, '')
			}
		}
	}
};

export default config;
