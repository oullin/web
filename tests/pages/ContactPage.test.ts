import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, afterEach } from 'vitest';
import ContactPage from '@pages/ContactPage.vue';
import type { ProfileResponse, LinksResponse } from '@api/response/index.ts';
import { contactPageContent } from '@support/content/contact-page.ts';
import { NAV_SOCIAL_FALLBACKS } from '@support/links.ts';

const profile: ProfileResponse = {
	nickname: 'Oullin',
	handle: 'oullin',
	name: 'Oullin',
	email: 'hello@oullin.io',
	profession: 'Platform',
	skills: [],
};

const links: LinksResponse[] = [
	{
		uuid: 'social-1',
		name: 'github',
		handle: 'oullin',
		url: 'https://github.com/oullin',
		description: 'GitHub',
	},
	{
		uuid: 'social-2',
		name: 'x',
		handle: 'oullin',
		url: 'https://x.com/oullin',
		description: 'X',
	},
];

const getProfile = vi.fn<[], Promise<{ data: ProfileResponse }>>(() => Promise.resolve({ data: profile }));
const getLinks = vi.fn<[], Promise<{ data: LinksResponse[] }>>(() => Promise.resolve({ data: links }));

vi.mock('@api/store.ts', () => ({
	useApiStore: () => ({
		getProfile,
		getLinks,
	}),
}));

vi.mock('@support/deferred.ts', () => ({
	runAfterLoadAndIdle: (task: () => void) => {
		void task();
		return () => {};
	},
}));

const global = {
	stubs: {
		NavPartial: true,
		FooterPartial: true,
	},
};

describe('ContactPage', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('loads contact details and renders the contact page', async () => {
		const wrapper = mount(ContactPage, { global });
		await flushPromises();

		expect(getProfile).toHaveBeenCalled();
		expect(getLinks).toHaveBeenCalled();
		expect(wrapper.text()).toContain(contactPageContent.hero.title);
		contactPageContent.hero.copy.forEach((paragraph) => {
			expect(wrapper.text()).toContain(paragraph);
		});
		expect(wrapper.text()).toContain(contactPageContent.sidebar.primaryChannel.copy);
		expect(wrapper.text()).toContain(profile.email);
		expect(wrapper.text()).toContain('LINKEDIN');
		expect(wrapper.text()).toContain('GITHUB');
		expect(wrapper.text()).toContain('X');
		expect(wrapper.findAll('.page-social-separator')).toHaveLength(Object.keys(NAV_SOCIAL_FALLBACKS).length - 1);
	});

	it('shows fallback copy when contact data is unavailable', async () => {
		getProfile.mockResolvedValueOnce({ data: null as unknown as ProfileResponse });
		getLinks.mockResolvedValueOnce({ data: [] });

		const wrapper = mount(ContactPage, { global });
		await flushPromises();

		expect(wrapper.text()).toContain(contactPageContent.sidebar.primaryChannel.fallbackTitle);
		expect(wrapper.text()).toContain(contactPageContent.sidebar.primaryChannel.fallbackCopy);
		for (const platform of Object.keys(NAV_SOCIAL_FALLBACKS)) {
			expect(wrapper.text()).toContain(platform.toUpperCase());
		}
	});

	it('handles API errors gracefully', async () => {
		getProfile.mockRejectedValueOnce(new Error('network failure'));
		getLinks.mockRejectedValueOnce(new Error('network failure'));

		const wrapper = mount(ContactPage, { global });
		await flushPromises();

		expect(wrapper.text()).toContain(contactPageContent.sidebar.primaryChannel.fallbackTitle);
		expect(wrapper.text()).toContain(contactPageContent.sidebar.primaryChannel.fallbackCopy);
		for (const platform of Object.keys(NAV_SOCIAL_FALLBACKS)) {
			expect(wrapper.text()).toContain(platform.toUpperCase());
		}
	});
});
