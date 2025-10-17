import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRouter, createMemoryHistory } from 'vue-router';
import type { Router } from 'vue-router';
import { nextTick } from 'vue';
import AvatarPartial from '@partials/AvatarPartial.vue';
import SideNavPartial from '@partials/SideNavPartial.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useApiStore } from '@api/store.ts';
import type { SocialResponse } from '@api/response/index.ts';
import { debugError } from '@api/http-error.ts';

vi.mock('@api/http-error.ts', () => ({ debugError: vi.fn() }));

const debugErrorMock = vi.mocked(debugError);

const social: SocialResponse[] = [
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

const routes = [
	{ path: '/', name: 'home', component: { template: '<div />' } },
	{ path: '/about', name: 'about', component: { template: '<div />' } },
	{ path: '/projects', name: 'projects', component: { template: '<div />' } },
	{ path: '/resume', name: 'resume', component: { template: '<div />' } },
	{ path: '/post/:slug', name: 'post', component: { template: '<div />' } },
];

function createTestRouter(initialPath: string): Router {
	const history = createMemoryHistory();
	history.replace(initialPath);

	return createRouter({
		history,
		routes,
	});
}

interface MountOptions {
	rejectWith?: Error;
}

async function mountSideNavAt(initialPath: string, { rejectWith }: MountOptions = {}): Promise<{ wrapper: VueWrapper; fetchSocialMock: ReturnType<typeof vi.spyOn> }> {
	const router = createTestRouter(initialPath);
	const pinia = createPinia();

	setActivePinia(pinia);

	const apiStore = useApiStore(pinia);
	apiStore.social = [];

	const fetchSocialMock = vi.spyOn(apiStore, 'fetchSocial').mockImplementation(async () => {
		if (rejectWith) {
			throw rejectWith;
		}

		apiStore.social = social;

		return apiStore.social;
	});

	const wrapper = mount(SideNavPartial, { global: { plugins: [router, pinia] } });

	await router.isReady();
	await flushPromises();

	return { wrapper, fetchSocialMock };
}

describe('SideNavPartial', () => {
	beforeEach(() => {
		debugErrorMock.mockClear();
	});

	it('hides the avatar on the home route', async () => {
		const { wrapper } = await mountSideNavAt('/');

		expect(wrapper.findComponent(AvatarPartial).exists()).toBe(false);

		wrapper.unmount();
	});

	it('shows the avatar on the about route', async () => {
		const { wrapper } = await mountSideNavAt('/about');

		expect(wrapper.findComponent(AvatarPartial).exists()).toBe(true);

		wrapper.unmount();
	});

	it('does not render social links on the about route', async () => {
		const { wrapper } = await mountSideNavAt('/about');

		const socialLinks = wrapper.findAll('a[rel="noopener noreferrer"]');

		expect(socialLinks).toHaveLength(0);

		wrapper.unmount();
	});

	it('shows the avatar on other non-home routes', async () => {
		const paths = ['/projects', '/resume', '/post/example-post'];

		for (const path of paths) {
			const { wrapper } = await mountSideNavAt(path);

			expect(wrapper.findComponent(AvatarPartial).exists()).toBe(true);

			wrapper.unmount();
		}
	});

	it('omits social links on the about route', async () => {
		const { wrapper, fetchSocialMock } = await mountSideNavAt('/about');

		await flushPromises();

		expect(fetchSocialMock).toHaveBeenCalled();
		expect(wrapper.find('div.mx-auto.h-px.w-8').exists()).toBe(false);
		expect(wrapper.findAll('a[rel="noopener noreferrer"]').length).toBe(0);

		wrapper.unmount();
	});

	it('uses default nav padding on the home route', async () => {
		const { wrapper } = await mountSideNavAt('/');

		const nav = wrapper.find('nav');

		expect(nav.classes()).toContain('pt-16');
		expect(nav.classes()).not.toContain('pt-12');
		expect(nav.classes()).not.toContain('md:pt-16');
		expect(nav.classes()).toContain('mt-2');

		wrapper.unmount();
	});

	it('does not apply additional top margin when the avatar is visible', async () => {
		const { wrapper } = await mountSideNavAt('/about');

		const nav = wrapper.find('nav');

		expect(nav.classes()).not.toContain('mt-2');

		wrapper.unmount();
	});

	it('aligns nav padding with the main content on content-aligned routes', async () => {
		const paths = ['/about', '/projects', '/resume', '/post/example-post'];

		for (const path of paths) {
			const { wrapper } = await mountSideNavAt(path);

			const nav = wrapper.find('nav');

			expect(nav.classes()).toContain('pt-12');
			expect(nav.classes()).toContain('md:pt-16');

			wrapper.unmount();
		}
	});

	it('renders social links after the primary navigation', async () => {
		const { wrapper, fetchSocialMock } = await mountSideNavAt('/projects');

		const socialLinks = wrapper.findAll('a[rel="noopener noreferrer"]');

		expect(fetchSocialMock).toHaveBeenCalled();
		expect(socialLinks).toHaveLength(social.length);
		expect(socialLinks[0].attributes('href')).toBe(social[0]?.url);
		expect(socialLinks[1].attributes('href')).toBe(social[1]?.url);
		expect(socialLinks[0].find('svg').classes()).toContain('fill-current');
		expect(socialLinks[1].find('svg').classes()).toContain('fill-current');

		const separator = wrapper.find('div.mx-auto.h-px.w-8');
		expect(separator.exists()).toBe(true);

		wrapper.unmount();
	});

	it('shows and hides a tooltip for social links on hover', async () => {
		const { wrapper } = await mountSideNavAt('/projects');

		const socialLink = wrapper.find('a[rel="noopener noreferrer"]');
		expect(socialLink.exists()).toBe(true);

		await socialLink.trigger('mouseenter');
		await nextTick();

		const tooltip = document.body.querySelector('.side-nav-tooltip') as HTMLElement | null;

		expect(tooltip).not.toBeNull();
		expect(tooltip?.textContent?.trim()).toBe('GitHub profile');
		expect(tooltip?.style.top).not.toBe('');
		expect(tooltip?.style.left).not.toBe('');

		await socialLink.trigger('mouseleave');
		await nextTick();

		const hiddenTooltip = document.body.querySelector('.side-nav-tooltip');
		expect(hiddenTooltip).toBeNull();

		wrapper.unmount();
	});

	it('logs failures while loading social links', async () => {
		const error = new Error('network');

		await mountSideNavAt('/projects', { rejectWith: error });

		expect(debugErrorMock).toHaveBeenCalledWith(error);
	});
});
