import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ArticleItemSkeletonPartial from '@partials/ArticleItemSkeletonPartial.vue';

describe('ArticleItemSkeletonPartial', () => {
	it('renders with animation enabled by default', () => {
		const wrapper = mount(ArticleItemSkeletonPartial);
		const article = wrapper.get('[data-testid="article-skeleton"]');
		expect(article.classes()).toContain('animate-pulse');
	});

	it('disables animation when isAnimated is false', () => {
		const wrapper = mount(ArticleItemSkeletonPartial, {
			props: { isAnimated: false },
		});
		const article = wrapper.get('[data-testid="article-skeleton"]');
		expect(article.classes()).not.toContain('animate-pulse');
	});
});
