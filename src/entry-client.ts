import { createApp } from '@/main';

const { app, router, pinia } = createApp();

// --- Hydrate state: Restore the state fetched from the server if found.
if (window.__INITIAL_STATE__) {
	// Info: The placeholder is a string, so we need to unescape it
	const decodedState = JSON.parse(decodeURIComponent(JSON.stringify(window.__INITIAL_STATE__)));
	pinia.state.value = JSON.parse(decodedState);
}

router.isReady().then(() => {
	app.mount('#app');
});
