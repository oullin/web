import { mount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProjectsPage from '@pages/ProjectsPage.vue';
import type { ProjectsResponse } from '@api/response/index.ts';
import ProjectCardSkeletonPartial from '@partials/ProjectCardSkeletonPartial.vue';

const projects: ProjectsResponse[] = [
	{
		uuid: faker.string.uuid(),
		title: faker.lorem.words(2),
		excerpt: faker.lorem.sentence(),
		url: faker.internet.url(),
		language: faker.lorem.word(),
		icon: faker.image.avatarGitHub(),
		is_open_source: true,
		published_at: faker.date.past().toISOString(),
		created_at: faker.date.past().toISOString(),
		updated_at: faker.date.recent().toISOString(),
	},
];

const getProjects = vi.fn<[], Promise<{ version: string; data: ProjectsResponse[] }>>();

beforeEach(() => {
	getProjects.mockReset();
	getProjects.mockResolvedValue({ version: '1.0.0', data: projects });
});

vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getProjects }) }));
vi.mock('@api/http-error.ts', () => ({ debugError: vi.fn() }));

const global = {
	stubs: {
		NavPartial: true,
		FooterPartial: true,
		BackToTopLink: true,
		WidgetSponsorPartial: true,
		WidgetSkillsTransitionWrapper: true,
		RouterLink: { template: '<a><slot /></a>' },
		ProjectCardPartial: { template: '<div class="project">{{ item.title }}</div>', props: ['item'] },
	},
};

describe('ProjectsPage', () => {
	it('loads projects', async () => {
		const wrapper = mount(ProjectsPage, { global });
		await flushPromises();
		expect(getProjects).toHaveBeenCalled();
		const items = wrapper.findAll('.project');
		expect(items).toHaveLength(projects.length);
		expect(wrapper.text()).toContain(projects[0].title);
	});

	it('renders empty state message when no projects are returned', async () => {
		getProjects.mockResolvedValueOnce({ version: '1.0.0', data: [] });
		const wrapper = mount(ProjectsPage, { global });
		await flushPromises();
		await nextTick();
		const skeletons = wrapper.findAllComponents(ProjectCardSkeletonPartial);
		expect(skeletons).toHaveLength(0);
		expect(wrapper.text()).toContain('Projects will be added soon. Check back later!');
		const skeletonGrid = wrapper.find('[data-testid="projects-skeleton-grid"]');
		expect(skeletonGrid.exists()).toBe(false);
	});

	it('handles API errors', async () => {
		const error = new Error('oops');
		getProjects.mockRejectedValueOnce(error);
		mount(ProjectsPage, { global });
		await flushPromises();
		await nextTick();
		const { debugError } = await import('@api/http-error.ts');
		expect(debugError).toHaveBeenCalledWith(error);
	});
});
