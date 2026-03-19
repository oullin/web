import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TermsAndPoliciesPage from '@pages/TermsAndPoliciesPage.vue';

const global = {
	stubs: {
		FooterPartial: { template: '<footer data-testid="site-footer"></footer>' },
		RouterLink: { template: '<a :to="to"><slot /></a>', props: ['to'] },
	},
};

describe('TermsAndPoliciesPage', () => {
	it('renders with the shared site chrome', () => {
		const wrapper = mount(TermsAndPoliciesPage, { global });

		expect(wrapper.find('[data-testid="site-footer"]').exists()).toBe(true);
		expect(wrapper.find('h1').text()).toContain('Terms and Policies.');
	});

	it('links policy enquiries to the contact page', () => {
		const wrapper = mount(TermsAndPoliciesPage, { global });

		const contactLink = wrapper.findAll('a').find((link) => link.text() === 'Contact page');
		expect(contactLink?.attributes('to')).toBe('/contact');
	});
});
