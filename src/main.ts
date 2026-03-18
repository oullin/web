import { createApp, App as VueApp } from 'vue';
import { createPinia, Pinia } from 'pinia';

// eslint-disable-next-line import/no-unassigned-import
import '@css/style.css';
import App from '@/App.vue';
import router from '@/router';
import { lazyLinkDirective } from '@support/lazy-loading.ts';
import { initSentry } from '@support/sentry.ts';

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

initSentry(app, router);

app.mount('#app');
