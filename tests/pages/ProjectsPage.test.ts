import { mount, flushPromises } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi } from 'vitest';
import ProjectsPage from '@pages/ProjectsPage.vue';
import type { ProfileResponse, ProfileSkillResponse, ProjectsResponse } from '@api/response/index.ts';

const skills: ProfileSkillResponse[] = [
    {
        uuid: faker.string.uuid(),
        percentage: faker.number.int({ min: 1, max: 100 }),
        item: faker.lorem.word(),
        description: faker.lorem.sentence(),
    },
];

const profile: ProfileResponse = {
    nickname: faker.person.firstName(),
    handle: faker.internet.userName(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    profession: faker.person.jobTitle(),
    skills,
};

const projects: ProjectsResponse[] = [
    {
        uuid: faker.string.uuid(),
        title: faker.lorem.words(2),
        excerpt: faker.lorem.sentence(),
        url: faker.internet.url(),
        language: faker.lorem.word(),
        icon: faker.image.avatarGitHub(),
        is_open_source: true,
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
    },
];

const getProfile = vi.fn<[], Promise<{ data: ProfileResponse }>>(() =>
    Promise.resolve({ data: profile })
);
const getProjects = vi.fn<[], Promise<{ version: string; data: ProjectsResponse[] }>>(() =>
    Promise.resolve({ version: '1.0.0', data: projects })
);

vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getProfile, getProjects }) }));

describe('ProjectsPage', () => {
    it('loads profile and projects', async () => {
        const wrapper = mount(ProjectsPage, {
            global: {
                stubs: {
                    SideNavPartial: true,
                    HeaderPartial: true,
                    WidgetSponsorPartial: true,
                    WidgetSkillsPartial: true,
                    FooterPartial: true,
                    ProjectCardPartial: { template: '<div class="project">{{ item.title }}</div>', props: ['item'] },
                },
            },
        });
        await flushPromises();
        expect(getProfile).toHaveBeenCalled();
        expect(getProjects).toHaveBeenCalled();
        const items = wrapper.findAll('.project');
        expect(items).toHaveLength(projects.length);
        expect(wrapper.text()).toContain(projects[0].title);
    });
});
