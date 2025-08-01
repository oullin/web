import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import WidgetSponsorPartial from '@partials/WidgetSponsorPartial.vue';

describe('WidgetSponsorPartial', () => {
	it('renders sponsor info', () => {
		const wrapper = mount(WidgetSponsorPartial);
		expect(wrapper.text()).toContain('Build The Site/App You Want!');
	});
});
