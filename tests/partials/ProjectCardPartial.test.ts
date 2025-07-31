import { mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import ProjectCardPartial from '@partials/ProjectCardPartial.vue';
import type { ProjectsResponse } from '@api/response/index.ts';

vi.mock('@/public.ts', () => ({
	image: (p: string) => `/img/${p}`,
	getRandomInt: () => 6,
}));

describe('ProjectCardPartial', () => {
	const item: ProjectsResponse = {
		uuid: faker.string.uuid(),
		title: faker.lorem.word(),
		excerpt: faker.lorem.sentence(),
		url: faker.internet.url(),
		is_open_source: false,
		created_at: faker.date.past().toISOString(),
		updated_at: faker.date.recent().toISOString(),
		language: faker.lorem.word(),
		icon: faker.image.avatarGitHub(),
	};

	it('uses random icon path', () => {
		const wrapper = mount(ProjectCardPartial, { props: { item } });
		expect(wrapper.find('img').attributes('src')).toBe('/img/icons/icon-06.svg');
	});
});
