import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { fileURLToPath } from 'node:url';

const reactNativeFsShim = fileURLToPath(
	new URL('./src/lib/shims/react-native-fs.ts', import.meta.url)
);

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			jsmediatags: 'jsmediatags/build2/jsmediatags.js',
			'react-native-fs': reactNativeFsShim
		}
	},
	build: {
		target: 'ES2020',
		minify: 'esbuild',
		reportCompressedSize: false,
		cssMinify: 'lightningcss'
	},
	server: {
		fs: {
			allow: ['.']
		}
	}
});
