import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import FooterPartial from '@partials/FooterPartial.vue';
import { siteContent } from '@support/content.ts';

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
		expect(wrapper.text()).toContain(siteContent.footer.brandLine);
		expect(wrapper.text()).toContain(siteContent.footer.links[0].label);
		expect(wrapper.text()).toContain(siteContent.footer.links[1].label);
		expect(wrapper.text()).toContain(siteContent.footer.backToTopLabel);

		const contactLink = wrapper.findAll('a').find((a) => a.text() === siteContent.footer.links[0].label);
		expect(contactLink?.attributes('to')).toBe('/contact');

		const termsLink = wrapper.findAll('a').find((a) => a.text() === siteContent.footer.links[1].label);
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
		siteContent.footer.marqueeItems.forEach((item) => {
			expect(wrapper.text()).toContain(item);
		});
		expect(wrapper.text()).not.toContain('///');
	});

	it('does not render the marquee by default', () => {
		const wrapper = mount(FooterPartial, { global });
		expect(wrapper.find('.marquee-wrap').exists()).toBe(false);
	});
});
