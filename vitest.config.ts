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
			lines: 90,
			functions: 90,
			branches: 85,
			statements: 90,
			all: true,
			include: ['src/stores/**/*.ts'],
		},
	},
});
