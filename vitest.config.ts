import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@css': path.resolve(__dirname, './src/css'),
			'@pages': path.resolve(__dirname, './src/pages'),
			'@fonts': path.resolve(__dirname, './src/fonts'),
			'@images': path.resolve(__dirname, './src/images'),
			'@public': path.resolve(__dirname, './src/public'),
			'@partials': path.resolve(__dirname, './src/partials'),
			'@stores': path.resolve(__dirname, './src/stores'),
			'@api': path.resolve(__dirname, './src/stores/api'),
		},
	},
	test: {
		environment: 'jsdom',
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html'],
			lines: 85,
			functions: 85,
			branches: 85,
			statements: 85,
			all: true,
			include: ['src/stores/**/*.ts'],
		},
	},
});
