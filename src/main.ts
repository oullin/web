import { createApp, App as VueApp } from 'vue';
import { createPinia, Pinia } from 'pinia';

import router from '@/router';
import App from '@/App.vue';
import '@css/style.css';
import { lazyLinkDirective } from '@/support/lazy-loading.ts';

const app: VueApp = createApp(App);
const pinia: Pinia = createPinia();

app.use(router);
app.use(pinia);

app.directive('lazy-link', lazyLinkDirective);

app.mount('#app');
