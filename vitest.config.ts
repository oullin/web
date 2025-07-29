import { defineConfig } from 'vitest/config';
import aliases from './aliases';

export default defineConfig({
        resolve: {
                alias: aliases,
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
