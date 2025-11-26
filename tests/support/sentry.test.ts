import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { App as VueApp } from 'vue';
import type { Router } from 'vue-router';

import { initializeSentry } from '@/support/sentry.ts';

describe('initializeSentry', () => {
	const app = {} as VueApp;
	const router = {} as Router;

	beforeEach(() => {
		document.head.innerHTML = '';
		vi.unstubAllEnvs();
		vi.restoreAllMocks();
		delete (window as any).Sentry;
		(window as any).__SENTRY_APP_INITIALIZED__ = false;
	});

	afterEach(() => {
		document.head.innerHTML = '';
		vi.unstubAllEnvs();
		vi.restoreAllMocks();
		delete (window as any).Sentry;
		delete (window as any).__SENTRY_APP_INITIALIZED__;
	});

	it('skips setup when no DSN is provided', () => {
		initializeSentry(app, router);

		expect(document.querySelector('script[data-sentry-loader]')).toBeNull();
	});

	it('initializes immediately when Sentry is already available', () => {
		const init = vi.fn();
		const browserTracingIntegration = vi.fn(() => 'trace');
		const replayIntegration = vi.fn(() => 'replay');

		(window as any).Sentry = { init, browserTracingIntegration, replayIntegration };

		vi.stubEnv('VITE_SENTRY_DSN', 'https://dsn.example/123');
		vi.stubEnv('VITE_API_ENV', 'production');
		vi.stubEnv('VITE_SENTRY_TRACES_SAMPLE_RATE', '0.5');
		vi.stubEnv('VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE', '0.2');
		vi.stubEnv('VITE_SENTRY_REPLAYS_ERROR_SAMPLE_RATE', '0.9');

		initializeSentry(app, router);

		expect(browserTracingIntegration).toHaveBeenCalledWith({ router });
		expect(replayIntegration).toHaveBeenCalledTimes(1);
		expect(init).toHaveBeenCalledWith(
			expect.objectContaining({
				app,
				dsn: 'https://dsn.example/123',
				environment: 'production',
				integrations: ['trace', 'replay'],
				tracesSampleRate: 0.5,
				replaysSessionSampleRate: 0.2,
				replaysOnErrorSampleRate: 0.9,
			}),
		);
	});

	it('loads the CDN script and initializes after it finishes loading', () => {
		const init = vi.fn();
		const browserTracingIntegration = vi.fn(() => 'trace');
		const replayIntegration = vi.fn(() => 'replay');

		vi.stubEnv('VITE_SENTRY_DSN', 'https://dsn.example/123');
		vi.stubEnv('VITE_API_ENV', 'staging');

		initializeSentry(app, router);

		const script = document.querySelector('script[data-sentry-loader]') as HTMLScriptElement | null;

		expect(script).not.toBeNull();
		expect(script?.src).toContain('browser.sentry-cdn.com');
		expect(init).not.toHaveBeenCalled();

		(window as any).Sentry = { init, browserTracingIntegration, replayIntegration };
		script?.dispatchEvent(new Event('load'));

		expect(browserTracingIntegration).toHaveBeenCalledWith({ router });
		expect(replayIntegration).toHaveBeenCalledTimes(1);
		expect(init).toHaveBeenCalledWith(
			expect.objectContaining({
				environment: 'staging',
				replaysSessionSampleRate: 0.1,
				replaysOnErrorSampleRate: 1,
			}),
		);
	});
});
