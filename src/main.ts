import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter } from '@/router';
import { createUnhead } from '@unhead/vue';

import '@css/style.css';
import App from '@/App.vue';

export function createApp() {
	const app = createSSRApp(App);
	const pinia = createPinia();
	const unhead = createUnhead();
	const router = createRouter();

	app.use(pinia);
	app.use(router);
	app.use(unhead as any); //hack for now!

	return { app, router, pinia, unhead };
}
