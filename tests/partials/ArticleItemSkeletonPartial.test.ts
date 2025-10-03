import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ArticleItemSkeletonPartial from '@partials/ArticleItemSkeletonPartial.vue';

describe('ArticleItemSkeletonPartial', () => {
	it('is animated by default', () => {
		const wrapper = mount(ArticleItemSkeletonPartial);

		expect(wrapper.classes()).toContain('animate-pulse');
	});

	it('can disable the animation', () => {
		const wrapper = mount(ArticleItemSkeletonPartial, {
			props: { isAnimated: false },
		});

		expect(wrapper.classes()).not.toContain('animate-pulse');
	});
});
