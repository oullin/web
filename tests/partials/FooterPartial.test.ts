import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import FooterPartial from '@partials/FooterPartial.vue';
import marquee from '@fixtures/marquee.json';

const scrollTo = vi.fn();

const global = { stubs: { RouterLink: { template: '<a :to="to"><slot /></a>', props: ['to'] } } };

describe('FooterPartial', () => {
	beforeEach(() => {
		scrollTo.mockReset();
		Object.defineProperty(window, 'scrollTo', {
			value: scrollTo,
			writable: true,
			configurable: true,
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('renders copyright', () => {
		const wrapper = mount(FooterPartial, { global });
		expect(wrapper.text()).toContain('OULLIN // MOVEMENT // CRAFT');
		expect(wrapper.text()).toContain('Contact');
		expect(wrapper.text()).toContain('Terms');
		expect(wrapper.text()).toContain('Back to top');

		const contactLink = wrapper.findAll('a').find((a) => a.text() === 'Contact');
		expect(contactLink?.attributes('to')).toBe('/contact');

		const termsLink = wrapper.findAll('a').find((a) => a.text() === 'Terms');
		expect(termsLink?.attributes('to')).toBe('/terms-and-conditions');
	});

	it('scrolls to the top when the footer action is clicked', async () => {
		const wrapper = mount(FooterPartial, { global });

		await wrapper.get('button.footer-link-button').trigger('click');

		expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
	});

	it('renders the marquee only when enabled', () => {
		const wrapper = mount(FooterPartial, { global, props: { showMarquee: true } });

		expect(wrapper.find('.marquee-wrap').exists()).toBe(true);
		marquee.items.forEach((item) => {
			expect(wrapper.text()).toContain(item);
		});
		expect(wrapper.text()).not.toContain('///');
	});

	it('does not render the marquee by default', () => {
		const wrapper = mount(FooterPartial, { global });
		expect(wrapper.find('.marquee-wrap').exists()).toBe(false);
	});
});
