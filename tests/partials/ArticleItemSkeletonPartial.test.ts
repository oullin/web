import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ArticleItemSkeletonPartial from '@partials/ArticleItemSkeletonPartial.vue';

describe('ArticleItemSkeletonPartial', () => {
	it('renders with animation enabled by default', async () => {
		const wrapper = mount(ArticleItemSkeletonPartial);
		await wrapper.vm.$nextTick();
		const skeleton = wrapper.find('[data-slot="skeleton"]');
		expect(skeleton.classes()).toContain('animate-pulse');
		expect(skeleton.classes()).not.toContain('animate-none');
	});

	it('disables animation when isAnimated is false', async () => {
		const wrapper = mount(ArticleItemSkeletonPartial, {
			props: { isAnimated: false },
		});
		await wrapper.vm.$nextTick();
		const skeleton = wrapper.find('[data-slot="skeleton"]');
		expect(skeleton.classes()).toContain('animate-none');
		expect(skeleton.classes()).not.toContain('animate-pulse');
	});
});
