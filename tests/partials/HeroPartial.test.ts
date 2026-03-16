import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import HeroPartial from '@partials/HeroPartial.vue';
import hero from '@fixtures/hero.json';

const global = {
	stubs: { RouterLink: { template: '<a><slot /></a>' } },
};

describe('HeroPartial', () => {
	it('renders the hero title', () => {
		const wrapper = mount(HeroPartial, { global });
		const h1 = wrapper.find('h1').text();
		hero.headline.forEach(({ text }) => {
			expect(h1).toContain(text);
		});
	});

	it('renders the eyebrow text', () => {
		const wrapper = mount(HeroPartial, { global });
		expect(wrapper.find('.eyebrow').text()).toBe(hero.eyebrow);
	});

	it('renders all data block labels', () => {
		const wrapper = mount(HeroPartial, { global });
		hero.dataBlocks.forEach((block) => {
			expect(wrapper.text()).toContain(block.label);
		});
	});

	it('renders cta buttons', () => {
		const wrapper = mount(HeroPartial, { global });
		hero.cta.forEach(({ label }) => {
			expect(wrapper.text()).toContain(label);
		});
	});
});
