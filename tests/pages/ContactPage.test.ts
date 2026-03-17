import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, afterEach } from 'vitest';
import ContactPage from '@pages/ContactPage.vue';
import type { ProfileResponse, LinksResponse } from '@api/response/index.ts';

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

vi.mock('@api/http-error.ts', () => ({ debugError: vi.fn() }));

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
		expect(wrapper.text()).toContain('Contact Oullin.');
		expect(wrapper.text()).toContain('high-availability software');
		expect(wrapper.text()).toContain('regulated or high-trust environment');
		expect(wrapper.text()).toContain(profile.email);
		expect(wrapper.text()).toContain('GITHUB');
		expect(wrapper.text()).toContain('X');
		expect(wrapper.findAll('.page-social-separator')).toHaveLength(links.length - 1);
	});

	it('shows fallback copy when contact data is unavailable', async () => {
		getProfile.mockResolvedValueOnce({ data: null as unknown as ProfileResponse });
		getLinks.mockResolvedValueOnce({ data: [] });

		const wrapper = mount(ContactPage, { global });
		await flushPromises();

		expect(wrapper.text()).toContain('Direct email');
		expect(wrapper.text()).toContain('LINKEDIN');
		expect(wrapper.text()).toContain('GITHUB');
	});

	it('handles API errors gracefully', async () => {
		const error = new Error('network failure');
		getProfile.mockRejectedValueOnce(error);

		mount(ContactPage, { global });
		await flushPromises();

		const { debugError } = await import('@api/http-error.ts');
		expect(debugError).toHaveBeenCalledWith(error);
	});
});
