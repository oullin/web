import { mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi } from 'vitest';
import RecommendationPartial from '@partials/RecommendationPartial.vue';
import type { RecommendationsResponse } from '@api/response/index.ts';

const renderMarkdown = vi.hoisted(() => vi.fn(() => '<p><strong>great</strong></p>'));

vi.mock('@/support/markdown.ts', () => ({ renderMarkdown }));
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
	});
});
