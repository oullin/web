import { createApp } from '@/main';
import { useApiStore } from '@api/store';
import { renderSSRHead } from '@unhead/ssr';
import { renderToString } from 'vue/server-renderer';

export async function render(url: string) {
	const { app, router, pinia, unhead } = createApp();
	const apiStore = useApiStore(pinia);

	// --- Pre-Fetch data: Call any boot action.
	apiStore.boot();

	await router.push(url);
	await router.isReady();

	const html = await renderToString(app);
	const headPayload = await renderSSRHead(unhead);

	// --- Serialise state.
	const initialState = JSON.stringify(pinia.state.value);

	return { html, initialState, ...headPayload };
}
