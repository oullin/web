import { createApp, App as VueApp } from 'vue';
import { createPinia, Pinia } from 'pinia';

// eslint-disable-next-line import/no-unassigned-import
import '@css/style.css';
import App from '@/App.vue';
import router from '@/router';
import { runAfterLoadAndIdle } from '@support/deferred.ts';
import { lazyLinkDirective } from '@support/lazy-loading.ts';

const root = document.documentElement;
const markFontsReady = () => root.classList.add('fonts-ready');

if ('fonts' in document) {
	void document.fonts.ready
		.then(() => {
			requestAnimationFrame(markFontsReady);
		})
		.catch(markFontsReady);
} else {
	markFontsReady();
}

const app: VueApp = createApp(App);
const pinia: Pinia = createPinia();

app.use(router);
app.use(pinia);

app.directive('lazy-link', lazyLinkDirective);

const sentryDsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;

if (sentryDsn) {
	runAfterLoadAndIdle(() => {
		void import('@support/sentry.ts').then(({ initSentry }) => {
			initSentry(app, router);
		});
	});
}

app.mount('#app');
