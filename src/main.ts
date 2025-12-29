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

if (sentryDsn) {
	Sentry.init({
		app,
		dsn: sentryDsn,
		// Sends default PII data (for example, IP address collection on events).
		sendDefaultPii: true,
	});
}

app.mount('#app');
