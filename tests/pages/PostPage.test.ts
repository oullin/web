import { mount, flushPromises } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi } from 'vitest';
import { ref } from 'vue';
import PostPage from '@pages/PostPage.vue';
import type { PostResponse } from '@api/response/index.ts';

const post: PostResponse = {
	uuid: faker.string.uuid(),
	slug: faker.lorem.slug(),
	title: faker.lorem.words(2),
	excerpt: faker.lorem.sentence(),
	content: faker.lorem.paragraph(),
	cover_image_url: faker.image.url(),
	published_at: faker.date.past().toISOString(),
	created_at: faker.date.past().toISOString(),
	updated_at: faker.date.recent().toISOString(),
	author: {
		uuid: faker.string.uuid(),
		first_name: faker.person.firstName(),
		last_name: faker.person.lastName(),
		username: faker.internet.userName(),
		display_name: faker.person.fullName(),
		bio: faker.lorem.sentence(),
		picture_file_name: faker.system.fileName(),
		profile_picture_url: faker.image.avatar(),
	},
	categories: [],
	tags: [],
};

const getPost = vi.fn<[], Promise<PostResponse>>(() => Promise.resolve(post));

vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getPost }) }));
vi.mock('vue-router', () => ({ useRoute: () => ({ params: { slug: post.slug } }) }));
vi.mock('marked', () => ({ marked: { use: vi.fn(), parse: vi.fn(() => '<p></p>') } }));
vi.mock('dompurify', () => ({ default: { sanitize: vi.fn((html: string) => html) } }));
vi.mock('highlight.js', () => ({ default: { highlightElement: vi.fn() } }));
vi.mock('@/dark-mode.ts', () => ({ useDarkMode: () => ({ isDark: ref(false) }) }));
vi.mock('@api/http-error.ts', () => ({ debugError: vi.fn() }));

describe('PostPage', () => {
	it('fetches post on mount', async () => {
		const wrapper = mount(PostPage, {
			global: {
				stubs: {
					SideNavPartial: true,
					HeaderPartial: true,
					FooterPartial: true,
					WidgetSponsorPartial: true,
					WidgetSkillsPartial: true,
					RouterLink: { template: '<a><slot /></a>' },
				},
			},
		});
		await flushPromises();
		expect(getPost).toHaveBeenCalledWith(post.slug);
		expect(wrapper.text()).toContain(post.title);
	});

	it('processes markdown content', async () => {
		const { marked } = await import('marked');
		const DOMPurify = await import('dompurify');
		const wrapper = mount(PostPage, {
			global: {
				stubs: {
					SideNavPartial: true,
					HeaderPartial: true,
					FooterPartial: true,
					WidgetSponsorPartial: true,
					WidgetSkillsPartial: true,
					RouterLink: { template: '<a><slot /></a>' },
				},
			},
		});
		await flushPromises();
		expect(marked.parse).toHaveBeenCalledWith(post.content);
		expect(DOMPurify.default.sanitize).toHaveBeenCalled();
		expect(wrapper.html()).toContain('<p></p>');
	});

	it('handles post errors gracefully', async () => {
		const error = new Error('fail');
		getPost.mockRejectedValueOnce(error);
		const wrapper = mount(PostPage, {
			global: {
				stubs: {
					SideNavPartial: true,
					HeaderPartial: true,
					FooterPartial: true,
					WidgetSponsorPartial: true,
					WidgetSkillsPartial: true,
					RouterLink: { template: '<a><slot /></a>' },
				},
			},
		});
		await flushPromises();
		const { debugError } = await import('@api/http-error.ts');
		expect(debugError).toHaveBeenCalledWith(error);
	});
});
