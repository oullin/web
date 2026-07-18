import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import WorkWithUsPage from '@pages/WorkWithUsPage.vue';
import { workWithUsPageContent } from '@support/content/work-with-us-page.ts';

const global = {
	stubs: {
		FooterPartial: true,
		RouterLink: { template: '<a :to="to"><slot /></a>', props: ['to'] },
	},
};

describe('WorkWithUsPage', () => {
	it('renders the fixture-backed engagement page shell', () => {
		const wrapper = mount(WorkWithUsPage, { global });

		expect(wrapper.text()).toContain(workWithUsPageContent.hero.title);
		workWithUsPageContent.hero.copy.forEach((paragraph) => {
			expect(wrapper.text()).toContain(paragraph);
		});
		expect(wrapper.text()).toContain(workWithUsPageContent.engagements[0].label);
		expect(wrapper.text()).toContain(workWithUsPageContent.faq.items[0].question);
		expect(wrapper.text()).toContain(workWithUsPageContent.cta.button.label);
	});

	it('replaces engagement prices with contact links', () => {
		const wrapper = mount(WorkWithUsPage, { global });
		const moreInfoLinks = wrapper.findAll('a').filter((link) => link.text() === 'More info');

		expect(moreInfoLinks).toHaveLength(workWithUsPageContent.engagements.length);
		moreInfoLinks.forEach((link) => {
			expect(link.attributes('to')).toBe('/contact');
		});
		expect(wrapper.text()).not.toMatch(/\$[\d,]+/);
	});
});
