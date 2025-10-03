import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TalkCardSkeletonPartial from '@partials/TalkCardSkeletonPartial.vue';

describe('TalkCardSkeletonPartial', () => {
	it('applies animation by default', () => {
		const wrapper = mount(TalkCardSkeletonPartial);

		expect(wrapper.attributes('class')).toContain('animate-pulse');
		expect(wrapper.attributes('aria-hidden')).toBe('true');
	});

	it('respects disabled animation flag', () => {
		const wrapper = mount(TalkCardSkeletonPartial, {
			props: { isAnimated: false },
		});

		expect(wrapper.attributes('class')).not.toContain('animate-pulse');
	});
});
