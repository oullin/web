import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import aliases from './aliases';
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
	resolve: {
		alias: aliases,
	},
});
