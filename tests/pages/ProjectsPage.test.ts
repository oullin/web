import { mount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProjectsPage from '@pages/ProjectsPage.vue';
import type { ProfileResponse, ProfileSkillResponse, ProjectsResponse } from '@api/response/index.ts';
import ProjectCardSkeletonPartial from '@partials/ProjectCardSkeletonPartial.vue';

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

const getProfile = vi.fn<[], Promise<{ data: ProfileResponse }>>();
const getProjects = vi.fn<[], Promise<{ version: string; data: ProjectsResponse[] }>>();

beforeEach(() => {
	getProfile.mockReset();
	getProjects.mockReset();

	getProfile.mockResolvedValue({ data: profile });
	getProjects.mockResolvedValue({ version: '1.0.0', data: projects });
});

vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getProfile, getProjects }) }));
vi.mock('@api/http-error.ts', () => ({ debugError: vi.fn() }));

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

	it('renders static skeletons when no projects are returned', async () => {
		getProjects.mockResolvedValueOnce({ version: '1.0.0', data: [] });

		const wrapper = mount(ProjectsPage, {
			global: {
				stubs: {
					SideNavPartial: true,
					HeaderPartial: true,
					WidgetSponsorPartial: true,
					WidgetSkillsPartial: true,
					FooterPartial: true,
					ProjectCardPartial: true,
				},
			},
		});

		await flushPromises();
		await nextTick();

		const skeletons = wrapper.findAllComponents(ProjectCardSkeletonPartial);
		expect(skeletons).toHaveLength(4);
		skeletons.forEach((skeleton) => {
			expect(skeleton.classes()).not.toContain('animate-pulse');
		});
	});

	it('handles API errors', async () => {
		const error = new Error('oops');
		getProfile.mockRejectedValueOnce(error);
		const wrapper = mount(ProjectsPage, {
			global: {
				stubs: {
					SideNavPartial: true,
					HeaderPartial: true,
					WidgetSponsorPartial: true,
					WidgetSkillsPartial: true,
					FooterPartial: true,
					ProjectCardPartial: true,
				},
			},
		});
		await flushPromises();
		await nextTick();
		const { debugError } = await import('@api/http-error.ts');
		expect(debugError).toHaveBeenCalledWith(error);
	});
});
