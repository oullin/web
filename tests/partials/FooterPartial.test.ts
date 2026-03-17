import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, afterEach } from 'vitest';
import FooterPartial from '@partials/FooterPartial.vue';

const getLinks = vi.fn().mockResolvedValue({ data: [] });

vi.mock('@api/store.ts', () => ({
	useApiStore: () => ({
		getLinks,
	}),
}));

vi.mock('@api/http-error.ts', () => ({ debugError: vi.fn() }));

const global = { stubs: { RouterLink: { template: '<a :to="to"><slot /></a>', props: ['to'] } } };

describe('FooterPartial', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('renders copyright', () => {
		const wrapper = mount(FooterPartial, { global });
		expect(wrapper.text()).toContain('OULLIN // MOVEMENT // CRAFT');
		expect(wrapper.text()).toContain('Contact');
		expect(wrapper.text()).toContain('Terms');

		const contactLink = wrapper.findAll('a').find((a) => a.text() === 'Contact');
		expect(contactLink?.attributes('to')).toBe('/contact');

		const termsLink = wrapper.findAll('a').find((a) => a.text() === 'Terms');
		expect(termsLink?.attributes('to')).toBe('/terms-and-conditions');
	});

	it('renders social links when the API returns data', async () => {
		getLinks.mockResolvedValueOnce({
			data: [
				{ name: 'x', url: 'https://x.com/oullin' },
				{ name: 'github', url: 'https://github.com/oullin' },
			],
		});

		const wrapper = mount(FooterPartial, { global });
		await flushPromises();

		const socialLinks = wrapper.findAll('a.footer-social-link[href]');
		expect(socialLinks).toHaveLength(2);
		expect(socialLinks[0].text()).toBe('X');
		expect(socialLinks[0].attributes('href')).toBe('https://x.com/oullin');
		expect(socialLinks[1].text()).toBe('GITHUB');
		expect(socialLinks[1].attributes('href')).toBe('https://github.com/oullin');
	});
});
