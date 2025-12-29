import { createApp, App as VueApp } from 'vue';
import { createPinia, Pinia } from 'pinia';
import * as Sentry from '@sentry/vue';

import '@css/style.css';
import App from '@/App.vue';
import router from '@/router';
import { lazyLinkDirective } from '@/support/lazy-loading.ts';

const app: VueApp = createApp(App);
const pinia: Pinia = createPinia();

app.use(router);
app.use(pinia);

app.directive('lazy-link', lazyLinkDirective);

const sentryDsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
const parseSampleRate = (value: string | undefined, fallback: number): number => {
	if (value == null || value === '') {
		return fallback;
	}

	const parsed = Number.parseFloat(value);

	if (!Number.isFinite(parsed)) {
		return fallback;
	}

	if (parsed < 0) {
		return 0;
	}

	if (parsed > 1) {
		return 1;
	}

	return parsed;
};

if (sentryDsn) {
	Sentry.init({
		app,
		dsn: sentryDsn,
		// Sends default PII data (for example, IP address collection on events).
		sendDefaultPii: true,
		// Re-enable performance monitoring, session replay, release and environment tracking.
		integrations: [Sentry.browserTracingIntegration({ router }), Sentry.replayIntegration()],
		tracesSampleRate: parseSampleRate(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE, 1.0),
		replaysSessionSampleRate: parseSampleRate(import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE, 0.1),
		replaysOnErrorSampleRate: parseSampleRate(import.meta.env.VITE_SENTRY_REPLAYS_ERROR_SAMPLE_RATE, 1.0),
		release: import.meta.env.VITE_SENTRY_RELEASE || `web@${import.meta.env.VITE_APP_VERSION || 'unknown'}`,
		environment: import.meta.env.VITE_API_ENV ?? import.meta.env.MODE ?? 'development',
	});
}

app.mount('#app');
