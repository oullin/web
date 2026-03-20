import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, afterEach } from 'vitest';
import HomePage from '@pages/HomePage.vue';
import { defineComponent } from 'vue';
import { homePageContent } from '@support/content.ts';

const global = {
	stubs: {
		NavPartial: true,
		HeroPartial: true,
		FooterPartial: defineComponent({
			props: {
				showMarquee: {
					type: Boolean,
					default: false,
				},
			},
			template: '<footer data-testid="footer-partial" :data-show-marquee="showMarquee"></footer>',
		}),
		RouterLink: { props: ['to'], template: '<a :data-to="to"><slot /></a>' },
	},
};

describe('HomePage', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('enables the footer marquee on the home page', () => {
		const wrapper = mount(HomePage, { global });
		expect(wrapper.get('[data-testid="footer-partial"]').attributes('data-show-marquee')).toBe('true');
	});

	it('renders all principles', () => {
		const wrapper = mount(HomePage, { global });
		homePageContent.principles.items.forEach((p) => {
			expect(wrapper.text()).toContain(p.tag);
			expect(wrapper.text()).toContain(p.body);
		});
	});

	it('renders the about section with the Oullin brand copy', async () => {
		const wrapper = mount(HomePage, { global });
		await flushPromises();
		homePageContent.about.defaultName.forEach((part) => {
			expect(wrapper.text()).toContain(part);
		});
		expect(wrapper.text()).toContain(homePageContent.about.body.role);
		expect(wrapper.text()).toContain('20+ years across software');
		expect(wrapper.text()).toContain(homePageContent.about.body.originIntro);
		homePageContent.about.work.forEach((item) => {
			expect(wrapper.text()).toContain(item.title);
		});
	});

	it('renders the cta section', () => {
		const wrapper = mount(HomePage, { global });
		expect(wrapper.text()).toContain(homePageContent.cta.watermark);
		expect(wrapper.text()).toContain(homePageContent.cta.headlineAccent);
		expect(wrapper.text()).toContain(homePageContent.cta.button.label);
		expect(wrapper.text()).toContain('COMPLEX');

		const ctaLinks = wrapper.findAll('[data-to]');
		const targets = ctaLinks.map((el) => el.attributes('data-to'));
		expect(targets).toContain(homePageContent.aiEra.button.to);
		expect(targets).toContain(homePageContent.cta.button.to);
	});
});
