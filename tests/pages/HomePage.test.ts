import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, afterEach } from 'vitest';
import HomePage from '@pages/HomePage.vue';
import principles from '@fixtures/principles.json';
import about from '@fixtures/about.json';
import cta from '@fixtures/cta.json';
import { defineComponent } from 'vue';

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
		RouterLink: { template: '<a><slot /></a>' },
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
		principles.items.forEach((p) => {
			expect(wrapper.text()).toContain(p.tag);
			expect(wrapper.text()).toContain(p.body);
		});
	});

	it('renders the about section with the Oullin brand copy', async () => {
		const wrapper = mount(HomePage, { global });
		await flushPromises();
		about.defaultName.forEach((part) => {
			expect(wrapper.text()).toContain(part);
		});
		expect(wrapper.text()).toContain(about.body.role);
		expect(wrapper.text()).toContain('20+ years across software');
		expect(wrapper.text()).toContain('Aztec sacred day-sign of movement and transformation');
		about.work.forEach((item) => {
			expect(wrapper.text()).toContain(item.title);
		});
	});

	it('renders the cta section', () => {
		const wrapper = mount(HomePage, { global });
		expect(wrapper.text()).toContain(cta.watermark);
		expect(wrapper.text()).toContain(cta.headlineAccent);
		expect(wrapper.text()).toContain(cta.button.label);
		expect(wrapper.text()).toContain('COMPLEX');
	});
});
