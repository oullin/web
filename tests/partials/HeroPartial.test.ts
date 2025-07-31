import { mount } from '@vue/test-utils';
import HeroPartial from '@partials/HeroPartial.vue';
import AvatarPartial from '@partials/AvatarPartial.vue';

describe('HeroPartial', () => {
	it('renders avatar', () => {
		const wrapper = mount(HeroPartial);
		expect(wrapper.findComponent(AvatarPartial).exists()).toBe(true);
	});
});
