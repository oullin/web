import { defineConfig } from 'vitest/config';
import aliases from './aliases';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: aliases,
	},
	test: {
		environment: 'jsdom',
		setupFiles: ['./tests/setup.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html'],
			lines: 90,
			functions: 90,
			branches: 85,
			statements: 90,
			all: true,
			include: ['src/stores/**/*.ts', 'src/partials/**/*.vue', 'src/pages/**/*.vue', 'src/components/**/*.vue'],
		},
	},
});
