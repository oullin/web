import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import PostPageSkeletonPartial from '@partials/PostPageSkeletonPartial.vue';

describe('PostPageSkeletonPartial', () => {
	it('exposes a stable test id', () => {
		const wrapper = mount(PostPageSkeletonPartial);

		const root = wrapper.get('[data-testid="post-page-skeleton"]');
		expect(root.exists()).toBe(true);
	});

	it('is identified as non-interactive placeholder', () => {
		const wrapper = mount(PostPageSkeletonPartial);

		expect(wrapper.attributes('aria-hidden')).toBe('true');
		expect(wrapper.attributes('class')).toContain('animate-pulse');
	});
});
