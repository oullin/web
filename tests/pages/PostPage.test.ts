import { mount, flushPromises } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { defineComponent, ref } from 'vue';
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
	tags: [
		{
			uuid: faker.string.uuid(),
			name: faker.lorem.word(),
			description: faker.lorem.sentence(),
		},
		{
			uuid: faker.string.uuid(),
			name: faker.lorem.word(),
			description: faker.lorem.sentence(),
		},
	],
};

const getPost = vi.fn<[], Promise<PostResponse>>(() => Promise.resolve(post));
const setSearchTerm = vi.fn();

vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getPost, setSearchTerm }) }));
vi.mock('vue-router', () => ({ useRoute: () => ({ params: { slug: post.slug } }) }));
const renderMarkdown = vi.hoisted(() => vi.fn(() => '<p></p>'));
const initializeHighlighter = vi.hoisted(() => vi.fn(() => Promise.resolve()));

vi.mock('@/support/markdown.ts', () => ({ renderMarkdown, initializeHighlighter }));
vi.mock('dompurify', () => ({ default: { sanitize: vi.fn((html: string) => html) } }));
vi.mock('highlight.js/lib/core', () => ({
	default: {
		highlightElement: vi.fn(),
		registerLanguage: vi.fn(),
		registerAliases: vi.fn(),
	},
}));
vi.mock('@/dark-mode.ts', () => ({ useDarkMode: () => ({ isDark: ref(false) }) }));
vi.mock('@api/http-error.ts', () => ({ debugError: vi.fn() }));
vi.mock('@/public.ts', () => ({
	date: () => ({ format: () => '' }),
	getReadingTime: () => '',
}));

const RouterLinkStub = defineComponent({
	name: 'RouterLinkStub',
	props: {
		to: {
			type: [String, Object],
			required: true,
		},
	},
	emits: ['click'],
	template: "<a :href=\"typeof to === 'string' ? to : '#'\" @click=\"$emit('click', $event)\"><slot /></a>",
});

import PostPage from '@pages/PostPage.vue';

const mountComponent = () =>
	mount(PostPage, {
		global: {
			stubs: {
				SideNavPartial: true,
				HeaderPartial: true,
				FooterPartial: true,
				WidgetSponsorPartial: true,
				WidgetSocialPartial: true,
				WidgetSkillsPartial: true,
				RouterLink: RouterLinkStub,
			},
		},
	});

describe('PostPage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('fetches post on mount', async () => {
		const wrapper = mountComponent();
		const skeleton = wrapper.find('[data-testid="post-page-skeleton"]');
		expect(skeleton.exists()).toBe(true);
		expect(skeleton.classes()).toContain('min-h-[25rem]');
		await flushPromises();
		expect(getPost).toHaveBeenCalledWith(post.slug);
		expect(wrapper.find('[data-testid="post-page-skeleton"]').exists()).toBe(false);
		expect(wrapper.text()).toContain(post.title);
	});

	it('initializes highlight.js on mount', async () => {
		const wrapper = mountComponent();
		await flushPromises();
		const highlightCore = await import('highlight.js/lib/core');
		expect(initializeHighlighter).toHaveBeenCalledWith(highlightCore.default);
		expect(initializeHighlighter).toHaveBeenCalledTimes(2);
		expect(wrapper.exists()).toBe(true);
	});

	it('processes markdown content', async () => {
		const DOMPurify = await import('dompurify');
		const wrapper = mountComponent();
		await flushPromises();
		expect(renderMarkdown).toHaveBeenCalledWith(post.content);
		expect(DOMPurify.default.sanitize).toHaveBeenCalled();
		expect(wrapper.html()).toContain('<p></p>');
	});

	it('renders tags when available', async () => {
		const wrapper = mountComponent();
		await flushPromises();
		const tagContainer = wrapper.find('[data-testid="post-tags"]');
		expect(tagContainer.exists()).toBe(true);
		expect(tagContainer.element.tagName).toBe('NAV');
		const tags = wrapper.findAll('[data-testid="post-tag"]');
		expect(tags).toHaveLength(post.tags.length);
		const separators = wrapper.findAll('[data-testid="post-tag-separator"]');
		expect(separators).toHaveLength(Math.max(0, post.tags.length - 1));
		tags.forEach((tagWrapper, index) => {
			const expectedLabel = `#${post.tags[index]?.name.toUpperCase()}`;
			expect(tagWrapper.text()).toContain(expectedLabel);
		});
		const firstTag = tags[0];
		const firstTagLink = firstTag.findComponent(RouterLinkStub);
		expect(firstTagLink.props('to')).toEqual({ name: 'TagPosts', params: { tag: post.tags[0]?.name } });
	});

	it('populates the search term when a tag is clicked', async () => {
		const wrapper = mountComponent();
		await flushPromises();
		const firstTag = wrapper.find('[data-testid="post-tag"]');
		expect(firstTag.exists()).toBe(true);
		await firstTag.trigger('click');
		const expectedLabel = `#${post.tags[0]?.name.toUpperCase()}`;
		expect(setSearchTerm).toHaveBeenCalledWith(expectedLabel);
	});

	it('handles post errors gracefully', async () => {
		const error = new Error('fail');
		getPost.mockRejectedValueOnce(error);
		const wrapper = mountComponent();
		await flushPromises();
		const { debugError } = await import('@api/http-error.ts');
		expect(debugError).toHaveBeenCalledWith(error);
		expect(wrapper.find('[data-testid="post-page-skeleton"]').exists()).toBe(false);
		expect(wrapper.text()).toContain("We couldn't load this post.");
	});

	it('renders the follow widget above the sponsor widget', async () => {
		const wrapper = mountComponent();

		await flushPromises();

		const aside = wrapper.find('aside');
		expect(aside.exists()).toBe(true);

		const container = aside.find('div');
		expect(container.exists()).toBe(true);

		const children = container.element.children;
		expect(children.length).toBeGreaterThanOrEqual(2);
		expect(children[0].tagName).toBe('WIDGET-SOCIAL-PARTIAL-STUB');
		expect(children[1].tagName).toBe('WIDGET-SPONSOR-PARTIAL-STUB');
	});

	it('renders a back to top link targeting the post header', async () => {
		const wrapper = mountComponent();

		await flushPromises();

		const backToTopLink = wrapper.find('a[href="#post-top"]');
		expect(backToTopLink.exists()).toBe(true);
	});
});
