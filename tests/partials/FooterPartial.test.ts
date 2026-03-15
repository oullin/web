import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import FooterPartial from '@partials/FooterPartial.vue';

describe('FooterPartial', () => {
	it('renders copyright', () => {
		const wrapper = mount(FooterPartial, {
			global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
		});
		expect(wrapper.text()).toContain('OULLIN // GUSTAVO OCANTO');
		expect(wrapper.text()).toContain('Terms');
	});
});
