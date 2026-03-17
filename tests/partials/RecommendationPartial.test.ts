import { mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi } from 'vitest';
import RecommendationPartial from '@partials/RecommendationPartial.vue';
import type { RecommendationsResponse } from '@api/response/index.ts';

const renderMarkdown = vi.hoisted(() => vi.fn(() => '<p><strong>great</strong></p>'));
const initializeHighlighter = vi.hoisted(() => vi.fn(() => Promise.resolve()));
const loadHighlightTheme = vi.hoisted(() => vi.fn());

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

describe('RecommendationPartial', () => {
	const data: RecommendationsResponse[] = [
		{
			uuid: faker.string.uuid(),
			relation: 'friend',
			text: '**great**',
			created_at: faker.date.past().toISOString(),
			person: {
				full_name: faker.person.fullName(),
				company: faker.company.name(),
				avatar: faker.image.avatar(),
				designation: faker.person.jobTitle(),
			},
		},
	];

	const buildRecommendation = (index: number): RecommendationsResponse => ({
		uuid: faker.string.uuid(),
		relation: `relation-${index}`,
		text: `**great-${index}**`,
		created_at: faker.date.past().toISOString(),
		person: {
			full_name: `Person ${index}`,
			company: `Company ${index}`,
			avatar: faker.image.avatar(),
			designation: `Role ${index}`,
		},
	});

	it('sanitises and formats recommendation', async () => {
		const wrapper = mount(RecommendationPartial, {
			props: { recommendations: data },
		});
		expect(renderMarkdown).toHaveBeenCalledWith('**great**');

		await wrapper.find('[data-slot="accordion-trigger"]').trigger('click');

		expect(wrapper.html()).toContain('<strong>great</strong>');
		expect(wrapper.text()).toContain('now');
		expect(wrapper.text()).toContain(data[0].person.designation);
	});

	it('does not render designation markup when missing', () => {
		const wrapper = mount(RecommendationPartial, {
			props: {
				recommendations: [
					{
						...data[0],
						person: {
							...data[0].person,
							designation: '',
						},
					},
				],
			},
		});

		expect(wrapper.html()).not.toContain('text-sm text-slate-600 dark:text-slate-300');
	});

	it('adds a CTA point tooltip trigger to each visible recommendation row', () => {
		const wrapper = mount(RecommendationPartial, {
			props: { recommendations: data },
		});

		const points = wrapper.findAll('[data-testid="recommendation-row-point"]');
		expect(points).toHaveLength(1);
		expect(points[0].attributes('data-slot')).toBe('tooltip-trigger');
	});

	it('starts with all recommendation rows collapsed', () => {
		const wrapper = mount(RecommendationPartial, {
			props: { recommendations: data },
		});

		expect(wrapper.find('[data-slot="accordion-trigger"]').attributes('aria-expanded')).toBe('false');
		expect(wrapper.find('[data-slot="accordion-content"]').attributes()).toHaveProperty('hidden');
	});

	it('paginates recommendations by 8 items per page', async () => {
		const paginatedData = Array.from({ length: 9 }, (_, index) => buildRecommendation(index + 1));
		const wrapper = mount(RecommendationPartial, {
			props: { recommendations: paginatedData },
		});

		expect(wrapper.text()).toContain('Page 1 / 2');
		expect(wrapper.text()).toContain('Person 8');
		expect(wrapper.text()).not.toContain('Person 9');

		await wrapper.find('button[aria-label="Go to next recommendations page"]').trigger('click');

		expect(wrapper.text()).toContain('Page 2 / 2');
		expect(wrapper.text()).toContain('Person 9');
		expect(wrapper.findAll('[data-testid="recommendation-row-point"]')).toHaveLength(1);
		expect(wrapper.find('[data-slot="accordion-trigger"]').attributes('aria-expanded')).toBe('false');
		expect(wrapper.find('[data-slot="accordion-content"]').attributes()).toHaveProperty('hidden');
	});
});
