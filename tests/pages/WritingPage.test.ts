import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import WritingPage from '@pages/WritingPage.vue';
import { writingPageContent } from '@support/content/writing-page.ts';

const global = {
	stubs: {
		NavPartial: true,
		FooterPartial: true,
		ArticlesListPartial: { template: '<div data-testid="articles-list"></div>' },
		RouterLink: { template: '<a><slot /></a>' },
	},
};

describe('WritingPage', () => {
	it('renders the writing archive shell', () => {
		const wrapper = mount(WritingPage, { global });
		expect(wrapper.text()).toContain(writingPageContent.hero.title);
		writingPageContent.hero.copy.forEach((paragraph) => {
			expect(wrapper.text()).toContain(paragraph);
		});
		expect(wrapper.find('[data-testid="articles-list"]').exists()).toBe(true);
	});
});
