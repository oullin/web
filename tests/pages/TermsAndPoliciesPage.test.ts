import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TermsAndPoliciesPage from '@pages/TermsAndPoliciesPage.vue';
import { termsAndPoliciesPageContent } from '@support/content.ts';

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
		expect(wrapper.find('h1').text()).toContain(termsAndPoliciesPageContent.hero.title);
		termsAndPoliciesPageContent.hero.copy.forEach((paragraph) => {
			expect(wrapper.text()).toContain(paragraph);
		});
	});

	it('links policy enquiries to the contact page', () => {
		const wrapper = mount(TermsAndPoliciesPage, { global });
		const contactSection = termsAndPoliciesPageContent.legalSections.find((section) => section.contactLink);
		const normalizedText = wrapper
			.text()
			.replace(/\s+/g, ' ')
			.replace(/\s+([.,;:!?])/g, '$1')
			.trim();

		expect(contactSection).toBeDefined();
		expect(normalizedText).toContain(contactSection!.paragraphs[0]);
		const contactLink = wrapper.findAll('a').find((link) => link.attributes('to') === contactSection!.contactLink?.to);
		expect(contactLink?.text()).toBe(contactSection!.contactLink?.label);
	});
});
