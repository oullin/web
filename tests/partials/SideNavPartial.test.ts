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

	it('renders social links beneath the menu separated by a hyphen', async () => {
		const wrapper = await mountSideNavAt('/');

		const socialSection = wrapper.find('[data-testid="side-nav-social-links"]');
		expect(socialSection.exists()).toBe(true);

		const separator = wrapper.find('[data-testid="side-nav-social-separator"]');
		expect(separator.exists()).toBe(true);
		expect(separator.text().trim()).toBe('-');

		const socialLinks = socialSection.findAll('a[aria-label]');
		expect(socialLinks).toHaveLength(3);

		wrapper.unmount();
	});
});
