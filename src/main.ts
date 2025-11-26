import { createApp, App as VueApp } from 'vue';
import { createPinia, Pinia } from 'pinia';

import '@css/style.css';
import App from '@/App.vue';
import router from '@/router';
import { lazyLinkDirective } from '@/support/lazy-loading.ts';
import { initializeSentry } from '@/support/sentry.ts';

const app: VueApp = createApp(App);
const pinia: Pinia = createPinia();

app.use(router);
app.use(pinia);

app.directive('lazy-link', lazyLinkDirective);

initializeSentry(app, router);

app.mount('#app');
