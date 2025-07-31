import { mount, flushPromises } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi } from 'vitest';
import FeaturedProjectsPartial from '@partials/FeaturedProjectsPartial.vue';
import type { ProjectsResponse } from '@api/response/index.ts';

const projects: ProjectsResponse[] = [
        {
                uuid: faker.string.uuid(),
                title: faker.lorem.words(1),
                excerpt: faker.lorem.sentence(),
                url: faker.internet.url(),
                language: faker.lorem.word(),
                icon: faker.image.avatarGitHub(),
                is_open_source: true,
                created_at: faker.date.past().toISOString(),
                updated_at: faker.date.recent().toISOString(),
        },
        {
                uuid: faker.string.uuid(),
                title: faker.lorem.words(1),
                excerpt: faker.lorem.sentence(),
                url: faker.internet.url(),
                language: faker.lorem.word(),
                icon: faker.image.avatarGitHub(),
                is_open_source: true,
                created_at: faker.date.past().toISOString(),
                updated_at: faker.date.recent().toISOString(),
        },
        {
                uuid: faker.string.uuid(),
                title: faker.lorem.words(1),
                excerpt: faker.lorem.sentence(),
                url: faker.internet.url(),
                language: faker.lorem.word(),
                icon: faker.image.avatarGitHub(),
                is_open_source: true,
                created_at: faker.date.past().toISOString(),
                updated_at: faker.date.recent().toISOString(),
        },
];
const getProjects = vi.fn<[], Promise<{ version: string; data: ProjectsResponse[] }>>(
        () => Promise.resolve({ version: '1.0.0', data: projects }),
);

vi.mock('@api/store.ts', () => ({
	useApiStore: () => ({ getProjects }),
}));

describe('FeaturedProjectsPartial', () => {
	it('fetches projects on mount and limits to two', async () => {
		const wrapper = mount(FeaturedProjectsPartial);
		await flushPromises();
		expect(getProjects).toHaveBeenCalled();
		const anchors = wrapper.findAll('a');
		expect(anchors).toHaveLength(2);
		expect(anchors[0].text()).toContain(projects[0].title);
	});
});
