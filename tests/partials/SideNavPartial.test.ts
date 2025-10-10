import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { createRouter, createMemoryHistory } from 'vue-router';
import type { Router } from 'vue-router';
import AvatarPartial from '@partials/AvatarPartial.vue';
import SideNavPartial from '@partials/SideNavPartial.vue';

const routes = [
	{ path: '/', name: 'home', component: { template: '<div />' } },
	{ path: '/about', name: 'about', component: { template: '<div />' } },
	{ path: '/projects', name: 'projects', component: { template: '<div />' } },
	{ path: '/resume', name: 'resume', component: { template: '<div />' } },
];

function createTestRouter(initialPath: string): Router {
	const history = createMemoryHistory();
	history.replace(initialPath);

	return createRouter({
		history,
		routes,
	});
}

async function mountSideNavAt(initialPath: string): Promise<VueWrapper> {
	const router = createTestRouter(initialPath);
	const wrapper = mount(SideNavPartial, { global: { plugins: [router] } });

	await router.isReady();
	await flushPromises();

	return wrapper;
}

describe('SideNavPartial', () => {
	it('hides the avatar on the home route', async () => {
		const wrapper = await mountSideNavAt('/');

		expect(wrapper.findComponent(AvatarPartial).exists()).toBe(false);

		wrapper.unmount();
	});

	it('shows the avatar on non-home routes', async () => {
		const wrapper = await mountSideNavAt('/about');

		expect(wrapper.findComponent(AvatarPartial).exists()).toBe(true);

		wrapper.unmount();
	});
});
