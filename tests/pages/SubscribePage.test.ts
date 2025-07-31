import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import SubscribePage from '@pages/SubscribePage.vue';

describe('SubscribePage', () => {
	it('renders heading', () => {
		const wrapper = mount(SubscribePage, {
			global: {
				stubs: {
					SideNavPartial: true,
					HeaderPartial: true,
					WidgetSponsorPartial: true,
					FooterPartial: true,
				},
			},
		});
		expect(wrapper.find('h1').text()).toContain('Never miss an update');
	});
});
