import { flushPromises, mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { createRouter, createMemoryHistory, Router } from 'vue-router';
import AvatarPartial from '@partials/AvatarPartial.vue';
import SideNavPartial from '@partials/SideNavPartial.vue';

const routes = [
	{ path: '/', name: 'home', component: { template: '<div />' } },
	{ path: '/about', name: 'about', component: { template: '<div />' } },
	{ path: '/projects', name: 'projects', component: { template: '<div />' } },
	{ path: '/resume', name: 'resume', component: { template: '<div />' } },
];

function createTestRouter(initialPath: string): Router {
	return createRouter({
		history: createMemoryHistory({ initialEntries: [initialPath] }),
		routes,
	});
}

describe('SideNavPartial', () => {
	it('hides the avatar on the home route', async () => {
		const router = createTestRouter('/');
		const wrapper = mount(SideNavPartial, { global: { plugins: [router] } });
		await router.isReady();
		await flushPromises();

		expect(wrapper.findComponent(AvatarPartial).exists()).toBe(false);
	});

	it('shows the avatar on non-home routes', async () => {
		const router = createTestRouter('/about');
		const wrapper = mount(SideNavPartial, { global: { plugins: [router] } });
		await router.isReady();
		await flushPromises();

		expect(wrapper.findComponent(AvatarPartial).exists()).toBe(true);
	});
});
