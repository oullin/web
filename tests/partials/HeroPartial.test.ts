import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import HeroPartial from '@partials/HeroPartial.vue';
import AvatarPartial from '@partials/AvatarPartial.vue';

describe('HeroPartial', () => {
	it('renders the hero copy and avatar', () => {
		const wrapper = mount(HeroPartial);

		expect(wrapper.findComponent(AvatarPartial).exists()).toBe(true);
		expect(wrapper.text()).toContain('I write about coding, engineering, and');
	});
});
