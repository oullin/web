import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import HomePage from '@pages/HomePage.vue';
import marquee from '@fixtures/marquee.json';
import principles from '@fixtures/principles.json';
import about from '@fixtures/about.json';
import cta from '@fixtures/cta.json';

const global = {
	stubs: {
		NavPartial: true,
		HeroPartial: true,
		RouterLink: { template: '<a><slot /></a>' },
	},
};

describe('HomePage', () => {
	it('renders all marquee items', () => {
		const wrapper = mount(HomePage, { global });
		marquee.items.forEach((item) => {
			expect(wrapper.text()).toContain(item);
		});
	});

	it('renders all principles', () => {
		const wrapper = mount(HomePage, { global });
		principles.items.forEach((p) => {
			expect(wrapper.text()).toContain(p.tag);
			expect(wrapper.text()).toContain(p.body);
		});
	});

	it('renders the about section', () => {
		const wrapper = mount(HomePage, { global });
		about.name.forEach((part) => expect(wrapper.text()).toContain(part));
		expect(wrapper.text()).toContain(about.body.role);
		about.work.forEach((item) => {
			expect(wrapper.text()).toContain(item.title);
		});
	});

	it('renders the cta section', () => {
		const wrapper = mount(HomePage, { global });
		expect(wrapper.text()).toContain(cta.watermark);
		expect(wrapper.text()).toContain(cta.headlineAccent);
		expect(wrapper.text()).toContain(cta.button.label);
	});
});
