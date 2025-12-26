import type { App as VueApp } from 'vue';
import type { Router } from 'vue-router';

const SENTRY_SCRIPT_ATTRIBUTE = 'data-sentry-loader';
const SENTRY_INITIALIZED_FLAG = '__SENTRY_APP_INITIALIZED__';
const SENTRY_CDN_URL = 'https://browser.sentry-cdn.com/10.32.1/bundle.tracing.replay.min.js';

type SentryBrowser = {
	init: (options: {
		app: VueApp;
		dsn: string;
		environment?: string;
		release?: string;
		integrations?: unknown[];
		tracesSampleRate?: number;
		replaysSessionSampleRate?: number;
		replaysOnErrorSampleRate?: number;
	}) => void;

	browserTracingIntegration: (options: { router: Router }) => unknown;
	replayIntegration: () => unknown;
	vueIntegration: (options: { app: VueApp }) => unknown;
};

type SentryWindow = Window & {
	Sentry?: SentryBrowser;
	[SENTRY_INITIALIZED_FLAG]?: boolean;
};

function parseRate(value: string | undefined, fallback: number): number {
	const rate = Number.parseFloat(value ?? '');

	if (Number.isNaN(rate) || rate < 0 || rate > 1) {
		return fallback;
	}

	return rate;
}

function configureSentry(app: VueApp, router: Router, sentry: SentryBrowser, dsn: string, environment: string): void {
	if ((window as SentryWindow)[SENTRY_INITIALIZED_FLAG] === true) {
		return;
	}

	const tracesSampleRate = parseRate(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE as string | undefined, 1.0);
	const replaysSessionSampleRate = parseRate(import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE as string | undefined, 0.1);
	const replaysOnErrorSampleRate = parseRate(import.meta.env.VITE_SENTRY_REPLAYS_ERROR_SAMPLE_RATE as string | undefined, 1.0);

	const release = (import.meta.env.VITE_SENTRY_RELEASE as string | undefined) || `web@${import.meta.env.VITE_APP_VERSION || 'unknown'}`;

	sentry.init({
		app,
		dsn,
		environment,
		release,
		integrations: [sentry.vueIntegration({ app }), sentry.browserTracingIntegration({ router }), sentry.replayIntegration()],
		tracesSampleRate,
		replaysSessionSampleRate,
		replaysOnErrorSampleRate,
	});

	(window as SentryWindow)[SENTRY_INITIALIZED_FLAG] = true;
}

function loadSentryScript(onReady: () => void, onError?: () => void): void {
	const existingScript = document.querySelector(`script[${SENTRY_SCRIPT_ATTRIBUTE}]`);

	if (existingScript) {
		existingScript.addEventListener('load', onReady, { once: true });

		if (onError) {
			existingScript.addEventListener('error', onError, { once: true });
		}

		return;
	}

	const script = document.createElement('script');

	script.src = SENTRY_CDN_URL;
	script.crossOrigin = 'anonymous';
	script.setAttribute(SENTRY_SCRIPT_ATTRIBUTE, 'true');
	script.addEventListener('load', onReady, { once: true });

	if (onError) {
		script.addEventListener('error', onError, { once: true });
	}

	document.head.appendChild(script);
}

export function initializeSentry(app: VueApp, router: Router): void {
	const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;

	if (!dsn || typeof window === 'undefined' || typeof document === 'undefined') {
		return;
	}

	const environment = (import.meta.env.VITE_API_ENV as string | undefined) ?? (import.meta.env.MODE as string | undefined) ?? 'development';

	const sentryWindow = window as SentryWindow;

	const onReady = (): void => {
		if (!sentryWindow.Sentry) {
			console.warn('[Sentry] SDK loaded but Sentry object not found');
			return;
		}

		configureSentry(app, router, sentryWindow.Sentry, dsn, environment);
	};

	const onError = (): void => {
		console.error('[Sentry] Failed to load SDK from CDN');
	};

	if (sentryWindow.Sentry) {
		onReady();
		return;
	}

	loadSentryScript(onReady, onError);
}
