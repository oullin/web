import { mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi } from 'vitest';
import RecommendationPartial from '@partials/RecommendationPartial.vue';
import BackToTopLink from '@partials/BackToTopLink.vue';
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
			props: { recommendations: data },
		});
		expect(renderMarkdown).toHaveBeenCalledWith('**great**');
		expect(wrapper.html()).toContain('<strong>great</strong>');
		expect(wrapper.text()).toContain('now');
		expect(wrapper.text()).toContain(data[0].person.designation);
		expect(wrapper.find('[aria-label="Recommendations pagination"]').exists()).toBe(false);
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

	it('does not render back-to-top link when no target is provided', () => {
		const wrapper = mount(RecommendationPartial, {
			props: { recommendations: data },
		});

		expect(wrapper.findComponent(BackToTopLink).exists()).toBe(false);
	});

	it('renders back-to-top link with provided target', () => {
		const wrapper = mount(RecommendationPartial, {
			props: {
				recommendations: data,
				backToTopTarget: '#resume-top',
			},
		});

		const backToTopLink = wrapper.getComponent(BackToTopLink);

		expect(backToTopLink.exists()).toBe(true);
		expect(backToTopLink.get('a').attributes('href')).toBe('#resume-top');
	});

	it('paginates recommendations and toggles pages', async () => {
		const recommendations = Array.from({ length: 4 }, () => ({
			...data[0],
			uuid: faker.string.uuid(),
			person: {
				...data[0].person,
				full_name: faker.person.fullName(),
			},
		}));

		const wrapper = mount(RecommendationPartial, {
			props: { recommendations },
		});

		const pageIndicator = () => wrapper.get('[aria-label="Recommendations pagination"] p');
		const [previousButton, nextButton] = wrapper.findAll('[aria-label="Recommendations pagination"] button');

		expect(previousButton.attributes('disabled')).toBeDefined();
		expect(nextButton.attributes('disabled')).toBeUndefined();
		expect(wrapper.text()).toContain(recommendations[0].person.full_name);
		expect(wrapper.text()).not.toContain(recommendations[3].person.full_name);
		expect(pageIndicator().text()).toBe('Page 1 of 2');

		await nextButton.trigger('click');

		expect(nextButton.attributes('disabled')).toBeDefined();
		expect(previousButton.attributes('disabled')).toBeUndefined();
		expect(wrapper.text()).toContain(recommendations[3].person.full_name);
		expect(wrapper.text()).not.toContain(recommendations[0].person.full_name);
		expect(pageIndicator().text()).toBe('Page 2 of 2');

		await previousButton.trigger('click');

		expect(previousButton.attributes('disabled')).toBeDefined();
		expect(nextButton.attributes('disabled')).toBeUndefined();
		expect(wrapper.text()).toContain(recommendations[0].person.full_name);
	});
});
