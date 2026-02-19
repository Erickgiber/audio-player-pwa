import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: true,
			strict: false
		}),
		alias: {
			$components: './src/lib/components',
			$stores: './src/lib/stores',
			$utils: './src/lib/utils',
			$types: './src/lib/types'
		}
	}
};
