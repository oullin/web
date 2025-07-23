import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

// Get the directory name equivalent to __dirname in ESM
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

export default defineConfig({
	define: {
		'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
	},
	plugins: [vue(), tailwindcss()],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		},
	},
	resolve: {
		alias: [
			{
				find: /^~.+/,
				replacement: '$1',
			},
			{ find: '@', replacement: path.resolve(__dirname, './src') },
			{ find: '@css', replacement: path.resolve(__dirname, './src/css') },
			{ find: '@pages', replacement: path.resolve(__dirname, './src/pages') },
			{ find: '@fonts', replacement: path.resolve(__dirname, './src/fonts') },
			{ find: '@images', replacement: path.resolve(__dirname, './src/images') },
			{ find: '@public', replacement: path.resolve(__dirname, './src/public') },
			{ find: '@partials', replacement: path.resolve(__dirname, './src/partials') },
			{ find: '@stores', replacement: path.resolve(__dirname, './src/stores') },
		],
	},
});
