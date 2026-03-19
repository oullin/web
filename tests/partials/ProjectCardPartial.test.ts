import { mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect } from 'vitest';
import ProjectCardPartial from '@partials/ProjectCardPartial.vue';
import type { ProjectsResponse } from '@api/response/index.ts';

describe('ProjectCardPartial', () => {
	const item: ProjectsResponse = {
		uuid: faker.string.uuid(),
		sort: 1,
		title: faker.lorem.word(),
		excerpt: faker.lorem.sentence(),
		url: faker.internet.url(),
		is_open_source: false,
		published_at: '2026-03-17T00:00:00Z',
		language: faker.lorem.word(),
		icon: 'Bot',
	};

	it('renders published date metadata when available', () => {
		const wrapper = mount(ProjectCardPartial, { props: { item } });
		expect(wrapper.text()).toContain('Published');
		expect(wrapper.text()).toContain('March');
		expect(wrapper.text()).toContain('2026');
	});

	it('hides timestamp when published_at is invalid', () => {
		const wrapper = mount(ProjectCardPartial, {
			props: {
				item: {
					...item,
					published_at: 'bad-date',
				},
			},
		});

		expect(wrapper.text()).not.toContain('Published');
		expect(wrapper.text()).not.toContain('April');
	});

	it('supports newer API icon names', () => {
		const wrapper = mount(ProjectCardPartial, { props: { item } });
		expect(wrapper.find('svg').exists()).toBe(true);
	});
});
