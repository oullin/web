import { defineConfig } from 'vite';
import aliasEntries from './aliases';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

const defaultApiPort = process.env.LOCAL_API_PORT ?? '18080';

const defaultWebPort = (() => {
	const raw = process.env.LOCAL_WEB_PORT;
	if (!raw) return undefined;
	const parsed = parseInt(raw, 10);
	return Number.isNaN(parsed) ? undefined : parsed;
})();

const relayTarget = (() => {
	try {
		const apiUrl = process.env.VITE_API_URL;

		return apiUrl ? new URL(apiUrl).origin : `http://localhost:${defaultApiPort}`;
	} catch {
		return `http://localhost:${defaultApiPort}`;
	}
})();

export default defineConfig({
	define: {
		'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
	},
	plugins: [vue(), tailwindcss()],
	resolve: {
		alias: aliasEntries,
	},
	server: {
		port: defaultWebPort,
		proxy: {
			'/relay': {
				target: relayTarget,
				changeOrigin: true,
				rewrite: (pathname: string) => pathname.replace(/^\/relay/, '/api'),
			},
		},
	},
});
