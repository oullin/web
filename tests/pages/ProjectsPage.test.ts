import { mount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProjectsPage from '@pages/ProjectsPage.vue';
import type { ProjectsCollectionResponse, ProjectsResponse } from '@api/response/index.ts';
import ProjectCardSkeletonPartial from '@partials/ProjectCardSkeletonPartial.vue';

const projectsPageOne: ProjectsResponse[] = [
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

const projectsPageTwo: ProjectsResponse[] = [
	{
		uuid: faker.string.uuid(),
		title: faker.lorem.words(3),
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

const buildCollection = (data: ProjectsResponse[], overrides: Partial<ProjectsCollectionResponse> = {}): ProjectsCollectionResponse => ({
	version: '1.0.0',
	page: 1,
	total: data.length,
	page_size: 8,
	total_pages: 1,
	next_page: null,
	previous_page: null,
	data,
	...overrides,
});

const getProjects = vi.fn();

beforeEach(() => {
	getProjects.mockReset();
	getProjects.mockImplementation((page = 1) => Promise.resolve(buildCollection(projectsPageOne, { page })));
});

vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getProjects }) }));
vi.mock('@api/http-error.ts', () => ({ debugError: vi.fn() }));

const global = {
	stubs: {
		NavPartial: true,
		FooterPartial: true,
		BackToTopLink: true,
		RouterLink: { template: '<a><slot /></a>' },
		ProjectCardPartial: { template: '<div class="project">{{ item.title }}</div>', props: ['item'] },
	},
};

describe('ProjectsPage', () => {
	it('loads projects', async () => {
		const wrapper = mount(ProjectsPage, { global });
		await flushPromises();
		expect(getProjects).toHaveBeenCalledWith(1);
		const items = wrapper.findAll('.project');
		expect(items).toHaveLength(projectsPageOne.length);
		expect(wrapper.text()).toContain('Proof from real systems.');
		expect(wrapper.text()).toContain('banking, consulting, product teams');
		expect(wrapper.text()).toContain(projectsPageOne[0].title);
	});

	it('renders empty state message when no projects are returned', async () => {
		getProjects.mockResolvedValueOnce(buildCollection([]));
		const wrapper = mount(ProjectsPage, { global });
		await flushPromises();
		await nextTick();
		const skeletons = wrapper.findAllComponents(ProjectCardSkeletonPartial);
		expect(skeletons).toHaveLength(0);
		expect(wrapper.text()).toContain('Projects will be added soon. Please check again later.');
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

	it('shows pagination and fetches the selected page', async () => {
		getProjects
			.mockResolvedValueOnce(buildCollection(projectsPageOne, { page: 1, total: 9, total_pages: 2, next_page: 2 }))
			.mockResolvedValueOnce(buildCollection(projectsPageTwo, { page: 2, total: 9, total_pages: 2, previous_page: 1 }));

		const wrapper = mount(ProjectsPage, { global });
		await flushPromises();

		expect(wrapper.get('[data-testid="projects-pagination"]').text()).toContain('Page 1 / 2');

		await wrapper.get('button[aria-label="Go to projects page 2"]').trigger('click');
		await flushPromises();
		await nextTick();

		expect(getProjects).toHaveBeenLastCalledWith(2);
		expect(wrapper.get('[data-testid="projects-pagination"]').text()).toContain('Page 2 / 2');
		expect(wrapper.text()).toContain(projectsPageTwo[0].title);
	});
});
