import { DOMWrapper, flushPromises, mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RecommendationPartial from '@partials/RecommendationPartial.vue';
import type { RecommendationsResponse } from '@api/response/index.ts';
import { siteContent } from '@support/content.ts';

const renderMarkdown = vi.hoisted(() => vi.fn((value: string) => `<p>${value}</p>`));
const initializeHighlighter = vi.hoisted(() => vi.fn(() => Promise.resolve()));
const loadHighlightTheme = vi.hoisted(() => vi.fn());
const getRecommendations = vi.hoisted(() => vi.fn());

vi.mock('@api/store.ts', () => ({
	useApiStore: () => ({ getRecommendations }),
}));
vi.mock('@api/http-error.ts', () => ({ debugError: vi.fn() }));
vi.mock('@/support/markdown.ts', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		renderMarkdown,
		initializeHighlighter,
		loadHighlightTheme,
	};
});
vi.mock('@/public.ts', () => ({
	image: (p: string) => `/img/${p}`,
	date: () => ({ format: () => 'now' }),
}));

const buildRecommendation = (index: number): RecommendationsResponse => ({
	uuid: faker.string.uuid(),
	relation: `relation-${index}`,
	text: `great-${index}`,
	created_at: faker.date.past().toISOString(),
	person: {
		full_name: `Person ${index}`,
		company: `Company ${index}`,
		avatar: faker.image.avatar(),
		designation: `Role ${index}`,
	},
});

describe('RecommendationPartial', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		document.body.innerHTML = '';
		document.body.style.overflow = '';
		vi.runOnlyPendingTimers();
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	it('does not request recommendations before the dialog is opened', () => {
		const wrapper = mount(RecommendationPartial);

		expect(wrapper.text()).toContain(siteContent.recommendations.intro);
		expect(getRecommendations).not.toHaveBeenCalled();
		expect(wrapper.get('[data-testid="recommendations-dialog-trigger"]').text()).toBe(siteContent.recommendations.triggerLabel);
		expect(wrapper.get('[data-testid="recommendations-dialog-trigger"]').element.tagName).toBe('BUTTON');

		wrapper.unmount();
	});

	it('opens the dialog and shows skeletons while recommendations are loading', async () => {
		getRecommendations.mockReturnValueOnce(new Promise(() => {}));

		const wrapper = mount(RecommendationPartial, { attachTo: document.body });

		await wrapper.get('[data-testid="recommendations-dialog-trigger"]').trigger('click');
		await vi.advanceTimersByTimeAsync(151);
		await nextTick();

		expect(getRecommendations).toHaveBeenCalledTimes(1);
		const dialogBody = new DOMWrapper(document.body);
		expect(dialogBody.find('[role="dialog"]').exists()).toBe(true);
		expect(dialogBody.find('[data-testid="recommendations-dialog-skeleton"]').exists()).toBe(true);
		expect(dialogBody.get('[data-slot="dialog-content"]').classes()).toEqual(expect.arrayContaining(['w-[96vw]', 'sm:max-w-[96vw]', 'xl:max-w-[98vw]']));

		wrapper.unmount();
	});

	it('sanitises and formats recommendations after the first dialog open', async () => {
		getRecommendations.mockResolvedValueOnce({ data: [buildRecommendation(1)] });

		const wrapper = mount(RecommendationPartial, { attachTo: document.body });

		await wrapper.get('[data-testid="recommendations-dialog-trigger"]').trigger('click');
		await vi.runAllTimersAsync();
		await flushPromises();
		await nextTick();

		const dialogBody = new DOMWrapper(document.body);
		expect(renderMarkdown).toHaveBeenCalledWith('great-1');
		expect(dialogBody.text()).toContain('Person 1');
		expect(dialogBody.text()).toContain('Company 1');
		expect(dialogBody.text()).toContain('Role 1');
		expect(dialogBody.text()).toContain('now');
		expect(dialogBody.get('[data-testid="recommendation-accordion-item"]').classes()).toContain('bg-transparent');
		expect(dialogBody.find('[data-testid="recommendation-accordion-content"]').exists()).toBe(false);

		await dialogBody.get('[data-slot="accordion-trigger"]').trigger('click');
		await flushPromises();
		await nextTick();

		expect(dialogBody.html()).toContain('<p>great-1</p>');

		wrapper.unmount();
	});

	it('paginates recommendations in the dialog and resets to page one when reopened', async () => {
		getRecommendations.mockResolvedValueOnce({ data: Array.from({ length: 9 }, (_, index) => buildRecommendation(index + 1)) });

		const wrapper = mount(RecommendationPartial, { attachTo: document.body });

		await wrapper.get('[data-testid="recommendations-dialog-trigger"]').trigger('click');
		await vi.runAllTimersAsync();
		await flushPromises();
		await nextTick();

		const dialogBody = new DOMWrapper(document.body);
		expect(dialogBody.text()).toContain('Page 1 / 2');
		expect(dialogBody.text()).toContain('Person 8');
		expect(dialogBody.text()).not.toContain('Person 9');
		expect(dialogBody.findAll('[data-testid="recommendation-accordion-item"]')).toHaveLength(8);
		expect(dialogBody.get('[data-testid="recommendations-dialog-pagination"]').classes()).not.toContain('page-editorial-row');
		expect(dialogBody.find('[data-testid="recommendations-dialog-pagination-controls"]').exists()).toBe(true);
		expect(dialogBody.find('[data-testid="recommendations-dialog-pagination-pages"]').exists()).toBe(true);
		expect(dialogBody.get('button[aria-label="Go to previous recommendations page"]').attributes('disabled')).toBeDefined();

		await dialogBody.findAll('[data-slot="accordion-trigger"]')[0].trigger('click');
		await nextTick();
		expect(dialogBody.find('[data-testid="recommendation-accordion-content"]').exists()).toBe(true);

		await dialogBody.get('button[aria-label="Go to next recommendations page"]').trigger('click');
		await nextTick();

		expect(dialogBody.text()).toContain('Page 2 / 2');
		expect(dialogBody.text()).toContain('Person 9');
		expect(dialogBody.findAll('[data-testid="recommendation-accordion-item"]')).toHaveLength(1);
		expect(dialogBody.find('[data-testid="recommendation-accordion-content"]').exists()).toBe(false);
		expect(dialogBody.get('button[aria-label="Go to next recommendations page"]').attributes('disabled')).toBeDefined();

		await dialogBody.get('[data-testid="recommendations-dialog-close-button"]').trigger('click');
		await nextTick();
		await wrapper.get('[data-testid="recommendations-dialog-trigger"]').trigger('click');
		await vi.runAllTimersAsync();
		await flushPromises();
		await nextTick();

		expect(getRecommendations).toHaveBeenCalledTimes(1);
		expect(new DOMWrapper(document.body).text()).toContain('Page 1 / 2');
		expect(new DOMWrapper(document.body).text()).toContain('Person 8');
		expect(new DOMWrapper(document.body).text()).not.toContain('Person 9');
		expect(new DOMWrapper(document.body).find('[data-testid="recommendation-accordion-content"]').exists()).toBe(false);

		wrapper.unmount();
	});

	it('keeps only one accordion item open at a time', async () => {
		getRecommendations.mockResolvedValueOnce({ data: [buildRecommendation(1), buildRecommendation(2)] });

		const wrapper = mount(RecommendationPartial, { attachTo: document.body });

		await wrapper.get('[data-testid="recommendations-dialog-trigger"]').trigger('click');
		await vi.runAllTimersAsync();
		await flushPromises();
		await nextTick();

		const dialogBody = new DOMWrapper(document.body);
		const triggers = dialogBody.findAll('[data-slot="accordion-trigger"]');

		await triggers[0].trigger('click');
		await nextTick();
		expect(dialogBody.findAll('[data-testid="recommendation-accordion-content"]')).toHaveLength(1);
		expect(dialogBody.text()).toContain('great-1');

		await triggers[1].trigger('click');
		await nextTick();
		expect(dialogBody.findAll('[data-testid="recommendation-accordion-content"]')).toHaveLength(1);
		expect(dialogBody.text()).toContain('great-2');
		expect(dialogBody.text()).not.toContain('great-1');

		wrapper.unmount();
	});

	it('retries on a later open after a failed recommendation load', async () => {
		getRecommendations.mockRejectedValueOnce(new Error('fail')).mockResolvedValueOnce({ data: [buildRecommendation(1)] });

		const wrapper = mount(RecommendationPartial, { attachTo: document.body });

		await wrapper.get('[data-testid="recommendations-dialog-trigger"]').trigger('click');
		await vi.runAllTimersAsync();
		await flushPromises();
		await nextTick();

		const dialogBody = new DOMWrapper(document.body);
		expect(dialogBody.find('[data-testid="recommendations-dialog-error"]').exists()).toBe(true);
		expect(getRecommendations).toHaveBeenCalledTimes(1);

		await dialogBody.get('[data-testid="recommendations-dialog-close-button"]').trigger('click');
		await nextTick();
		await wrapper.get('[data-testid="recommendations-dialog-trigger"]').trigger('click');
		await vi.runAllTimersAsync();
		await flushPromises();
		await nextTick();

		expect(getRecommendations).toHaveBeenCalledTimes(2);
		expect(new DOMWrapper(document.body).text()).toContain('Person 1');

		wrapper.unmount();
	});
});
