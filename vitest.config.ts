import { defineConfig } from 'vitest/config';
import aliases from './aliases';

export default defineConfig({
	resolve: {
		alias: aliases,
	},
	test: {
		environment: 'node',
		setupFiles: ['./tests/setup.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html'],
			lines: 100,
			functions: 100,
			branches: 100,
			statements: 100,
			all: true,
			include: ['src/stores/**/*.ts'],
		},
	},
});
