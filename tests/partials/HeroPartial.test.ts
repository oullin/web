import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import HeroPartial from '@partials/HeroPartial.vue';

describe('HeroPartial', () => {
	it('renders the hero title', () => {
		const wrapper = mount(HeroPartial);
		expect(wrapper.find('h1').text()).toContain('EVERY');
		expect(wrapper.find('h1').text()).toContain('SIGNAL');
		expect(wrapper.find('h1').text()).toContain('MATTERS.');
	});

	it('renders the eyebrow text', () => {
		const wrapper = mount(HeroPartial);
		expect(wrapper.find('.eyebrow').text()).toBe('OULLIN.IO // SYSTEM ONLINE // OLLIN = MOVEMENT');
	});
});
