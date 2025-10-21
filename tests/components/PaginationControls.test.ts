import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import PaginationControls from '@components/PaginationControls.vue';

describe('PaginationControls', () => {
	it('emits events when navigating between pages', async () => {
		const wrapper = mount(PaginationControls, {
			props: { currentPage: 2, totalPages: 3, ariaLabel: 'Test pagination' },
		});

		const [previousButton, nextButton] = wrapper.findAll('button');

		await previousButton.trigger('click');
		await nextButton.trigger('click');

		expect(wrapper.emitted('previous')).toHaveLength(1);
		expect(wrapper.emitted('next')).toHaveLength(1);
	});

	it('disables navigation buttons at boundaries', () => {
		const wrapper = mount(PaginationControls, {
			props: { currentPage: 1, totalPages: 2 },
		});

		const [previousButton, nextButton] = wrapper.findAll('button');

		expect(previousButton.attributes('disabled')).toBeDefined();
		expect(nextButton.attributes('disabled')).toBeUndefined();
	});

	it('does not render when there is a single page', () => {
		const wrapper = mount(PaginationControls, {
			props: { currentPage: 1, totalPages: 1 },
		});

		expect(wrapper.find('nav').exists()).toBe(false);
	});
});
