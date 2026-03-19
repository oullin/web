import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import WritingPage from '@pages/WritingPage.vue';
import { writingPageContent } from '@support/content.ts';

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
		expect(wrapper.text()).toContain(writingPageContent.hero.copy[0]);
		expect(wrapper.find('[data-testid="articles-list"]').exists()).toBe(true);
	});
});
