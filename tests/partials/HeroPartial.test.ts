import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import HeroPartial from '@partials/HeroPartial.vue';
import HeroCircuitPartial from '@partials/HeroCircuitPartial.vue';
import { homePageContent } from '@support/content/home-page.ts';

const { hero } = homePageContent;

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

	it('renders the extracted circuit partial', () => {
		const wrapper = mount(HeroPartial, { global });
		expect(wrapper.findComponent(HeroCircuitPartial).exists()).toBe(true);
	});

	it('renders the Oullin subcopy lines', () => {
		const wrapper = mount(HeroPartial, { global });
		hero.sub.lines.forEach((line) => {
			expect(wrapper.text()).toContain(line);
		});
	});

	it('renders all data block labels', () => {
		const wrapper = mount(HeroPartial, { global });
		hero.dataBlocks.forEach((block) => {
			expect(wrapper.text()).toContain(block.label);
		});
	});

	it('renders the proof-led expertise blocks', () => {
		const wrapper = mount(HeroPartial, { global });
		const text = wrapper.text();
		hero.dataBlocks.forEach((block) => {
			if (block.type === 'metric') {
				expect(text).toContain(block.value);
				expect(text).toContain(block.valueSuffix.trim());
				block.note?.forEach((line) => {
					expect(text).toContain(line);
				});
			}

			if (block.type === 'list') {
				block.items.forEach((item) => {
					expect(text).toContain(item);
				});
			}

			if (block.type === 'quote') {
				block.lines?.forEach((line) => {
					expect(text).toContain(line);
				});
			}
		});
	});

	it('renders cta buttons', () => {
		const wrapper = mount(HeroPartial, { global });
		hero.cta.forEach(({ label }) => {
			expect(wrapper.text()).toContain(label);
		});
	});
});
