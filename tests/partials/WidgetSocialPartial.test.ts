import { mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect } from 'vitest';
import WidgetSocialPartial from '@partials/WidgetSocialPartial.vue';
import type { SocialNavLink } from '@support/social.ts';

describe('WidgetSocialPartial', () => {
	it('renders social links from props', () => {
		const socialLinks: SocialNavLink[] = [
			{
				href: faker.internet.url(),
				label: 'Code & Projects',
				icon: 'M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 4.97,16.5 4.97,16.5C4.05,15.82 5.06,15.82 5.06,15.82C6.06,15.89 6.63,16.83 6.63,16.83C7.5,18.31 8.95,17.88 9.5,17.61C9.58,17.03 9.84,16.6 10.12,16.34C7.89,16.1 5.5,15.27 5.5,11.5C5.5,10.39 5.89,9.53 6.5,8.84C6.38,8.58 6.08,7.7 6.63,6.5C6.63,6.5 7.43,6.26 9.5,7.7C10.27,7.5 11.14,7.39 12,7.39C12.86,7.39 13.73,7.5 14.5,7.7C16.57,6.26 17.37,6.5 17.37,6.5C17.92,7.7 17.62,8.58 17.5,8.84C18.11,9.53 18.5,10.39 18.5,11.5C18.5,15.27 16.1,16.1 13.88,16.34C14.24,16.64 14.5,17.27 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0,0,0,12,2Z',
			},
		];
		const wrapper = mount(WidgetSocialPartial, {
			props: { social: socialLinks },
		});
		const anchors = wrapper.findAll('a');
		expect(anchors).toHaveLength(1);
		expect(anchors[0].attributes('href')).toBe(socialLinks[0].href);
		expect(anchors[0].text()).toContain('Code & Projects');
	});
});
