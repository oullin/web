import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createRouter, createMemoryHistory } from 'vue-router';
import type { Router } from 'vue-router';
import { setActivePinia, createPinia } from 'pinia';
import { faker } from '@faker-js/faker';
import AvatarPartial from '@partials/AvatarPartial.vue';
import SideNavPartial from '@partials/SideNavPartial.vue';
import type { SocialResponse, ApiResponse } from '@api/response/index.ts';

const social: SocialResponse[] = [
	{
		uuid: faker.string.uuid(),
		name: 'github',
		handle: faker.internet.userName(),
		url: faker.internet.url(),
		description: faker.lorem.words(2),
	},
	{
		uuid: faker.string.uuid(),
		name: 'linkedin',
		handle: faker.internet.userName(),
		url: faker.internet.url(),
		description: faker.lorem.words(2),
	},
	{
		uuid: faker.string.uuid(),
		name: 'x',
		handle: faker.internet.userName(),
		url: faker.internet.url(),
		description: faker.lorem.words(2),
	},
];

const getSocial = vi.fn<[], Promise<ApiResponse<SocialResponse[]>>>(() => Promise.resolve({ version: '1.0.0', data: social }));
vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getSocial }) }));

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
	const pinia = createPinia();
	const wrapper = mount(SideNavPartial, { global: { plugins: [router, pinia] } });

	await router.isReady();
	await flushPromises();

	return wrapper;
}

describe('SideNavPartial', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});
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
		expect(socialLinks).toHaveLength(2); // Component filters for github and linkedin only

		wrapper.unmount();
	});
});
