import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRouter, createMemoryHistory } from 'vue-router';
import type { Router } from 'vue-router';
import AvatarPartial from '@partials/AvatarPartial.vue';
import SideNavPartial from '@partials/SideNavPartial.vue';
import type { ApiResponse } from '@api/client.ts';

const { getSocial, debugError, social } = vi.hoisted(() => {
	const socialLinks = [
		{
			uuid: 'github-id',
			name: 'github',
			url: 'https://github.example.com',
			handle: 'GitHub',
			description: 'GitHub profile',
		},
		{
			uuid: 'linkedin-id',
			name: 'linkedin',
			url: 'https://linkedin.example.com',
			handle: 'LinkedIn',
			description: '',
		},
	];

	return {
		social: socialLinks,
		getSocial: vi.fn<[], Promise<ApiResponse<typeof socialLinks>>>(() => Promise.resolve({ version: '1.0.0', data: socialLinks })),
		debugError: vi.fn(),
	};
});

vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getSocial }) }));
vi.mock('@api/http-error.ts', () => ({ debugError }));

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
	beforeEach(() => {
		getSocial.mockClear();
		debugError.mockClear();
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

	it('renders social links after the primary navigation', async () => {
		const wrapper = await mountSideNavAt('/projects');

		const socialLinks = wrapper.findAll('a[rel="noopener noreferrer"]');

		expect(getSocial).toHaveBeenCalled();
		expect(socialLinks).toHaveLength(social.length);
		expect(socialLinks[0].attributes('href')).toBe(social[0]?.url);
		expect(socialLinks[1].attributes('href')).toBe(social[1]?.url);
		expect(socialLinks[0].find('svg').classes()).toContain('fill-current');
		expect(socialLinks[1].find('svg').classes()).toContain('fill-current');

		const separator = wrapper.find('div.mx-auto.h-px.w-8');
		expect(separator.exists()).toBe(true);

		wrapper.unmount();
	});

	it('logs failures while loading social links', async () => {
		const error = new Error('network');
		getSocial.mockRejectedValueOnce(error);

		await mountSideNavAt('/projects');

		expect(debugError).toHaveBeenCalledWith(error);
	});
});
