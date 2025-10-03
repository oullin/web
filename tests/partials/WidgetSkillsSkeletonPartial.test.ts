import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import WidgetSkillsSkeletonPartial from '@partials/WidgetSkillsSkeletonPartial.vue';

describe('WidgetSkillsSkeletonPartial', () => {
	it('renders six placeholder skill rows', () => {
		const wrapper = mount(WidgetSkillsSkeletonPartial);
		const items = wrapper.findAll('li');

		expect(items).toHaveLength(6);
		items.forEach((item) => {
			expect(item.classes()).toContain('flex');
		});
	});

	it('is marked as purely decorative', () => {
		const wrapper = mount(WidgetSkillsSkeletonPartial);

		expect(wrapper.attributes('aria-hidden')).toBeUndefined();
		expect(wrapper.classes()).toContain('animate-pulse');
	});
});
