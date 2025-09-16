import { createApp, App as VueApp } from 'vue';
import { createPinia, Pinia } from 'pinia';
import { createUnhead } from '@unhead/vue';

import router from '@/router';
import App from '@/App.vue';
import '@css/style.css';

const app: VueApp = createApp(App);
const pinia: Pinia = createPinia();
const unhead = createUnhead();

app.use(router);
app.use(pinia);
app.use(unhead as any);

app.mount('#app');
