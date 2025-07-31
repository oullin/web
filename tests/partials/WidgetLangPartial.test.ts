import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import WidgetLangPartial from '@partials/WidgetLangPartial.vue';

describe('WidgetLangPartial', () => {
	it('renders language list', () => {
		const wrapper = mount(WidgetLangPartial);
		const items = wrapper.findAll('li');
		expect(items).toHaveLength(2);
		expect(items[0].text()).toContain('English');
	});
});
