import { mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi } from 'vitest';
import RecommendationPartial from '@partials/RecommendationPartial.vue';
import type { RecommendationsResponse } from '@api/response/index.ts';

const renderMarkdown = vi.hoisted(() => vi.fn(() => '<p><strong>great</strong></p>'));
const initializeHighlighter = vi.hoisted(() => vi.fn());

vi.mock('@/support/markdown.ts', () => ({ renderMarkdown, initializeHighlighter }));
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

	it('sanitises and formats recommendation', () => {
		const wrapper = mount(RecommendationPartial, {
			props: { recommendations: data, backToTopTarget: '#top' },
		});
		expect(renderMarkdown).toHaveBeenCalledWith('**great**');
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
				backToTopTarget: '#top',
			},
		});

		expect(wrapper.html()).not.toContain('text-sm text-slate-600 dark:text-slate-300');
	});
});
