import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import HeroCircuitPartial from '@partials/HeroCircuitPartial.vue';

describe('HeroCircuitPartial', () => {
	it('renders the circuit svg and animated signal paths', () => {
		const wrapper = mount(HeroCircuitPartial);

		expect(wrapper.find('.circuit-bg').exists()).toBe(true);
		expect(wrapper.find('svg').exists()).toBe(true);
		expect(wrapper.findAll('.circuit-signal')).toHaveLength(5);
		expect(wrapper.find('filter#signal-glow').exists()).toBe(true);
	});
});
