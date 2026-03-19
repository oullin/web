import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import WritingPage from '@pages/WritingPage.vue';

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
		expect(wrapper.text()).toContain('Field notes from real systems.');
		expect(wrapper.text()).toContain('Patterns, decisions, and hard-won lessons from 20+ years of building software that has to keep working.');
		expect(wrapper.find('[data-testid="articles-list"]').exists()).toBe(true);
	});
});
