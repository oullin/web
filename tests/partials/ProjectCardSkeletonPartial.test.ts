import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ProjectCardSkeletonPartial from '@partials/ProjectCardSkeletonPartial.vue';

describe('ProjectCardSkeletonPartial', () => {
	it('renders animated wrapper by default', () => {
		const wrapper = mount(ProjectCardSkeletonPartial);

		expect(wrapper.classes()).toContain('animate-pulse');
	});

	it('merges custom wrapper classes', () => {
		const wrapper = mount(ProjectCardSkeletonPartial, {
			props: { wrapperClass: 'custom-class' },
		});

		expect(wrapper.classes()).toContain('custom-class');
	});

	it('disables animation when requested', () => {
		const wrapper = mount(ProjectCardSkeletonPartial, {
			props: { isAnimated: false },
		});

		expect(wrapper.classes()).not.toContain('animate-pulse');
	});
});
