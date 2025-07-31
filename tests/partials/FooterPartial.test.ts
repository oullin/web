import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import FooterPartial from '@partials/FooterPartial.vue';

describe('FooterPartial', () => {
	it('renders copyright', () => {
		const wrapper = mount(FooterPartial);
		expect(wrapper.text()).toContain('All rights reserved');
	});
});
