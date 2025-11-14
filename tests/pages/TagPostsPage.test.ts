import { mount, flushPromises } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { defineComponent, reactive } from 'vue';
import type { PostResponse, PostsCollectionResponse } from '@api/response/index.ts';

const buildPost = (index: number): PostResponse => ({
	uuid: `uuid-${index}`,
	slug: `post-${index}`,
	title: `Post Title ${index}`,
	excerpt: `Post Excerpt ${index}`,
	content: `Post Content ${index}`,
	cover_image_url: `/images/post-${index}.jpg`,
	published_at: new Date().toISOString(),
	created_at: new Date().toISOString(),
	updated_at: new Date().toISOString(),
	author: {
		uuid: `author-${index}`,
		first_name: 'Author',
		last_name: `${index}`,
		username: `author-${index}`,
		display_name: `Author ${index}`,
		bio: 'Bio',
		picture_file_name: `author-${index}.jpg`,
		profile_picture_url: `/images/authors/${index}.jpg`,
	},
	categories: [],
	tags: [],
});

const buildCollection = (posts: PostResponse[]): PostsCollectionResponse => ({
	page: 1,
	total: posts.length,
	page_size: posts.length,
	total_pages: 1,
	data: posts,
});

const posts = [buildPost(1), buildPost(2)];

const getPosts = vi.hoisted(() => vi.fn());
const debugError = vi.hoisted(() => vi.fn());
const routeParams = reactive<{ tag: string }>({ tag: 'design' });

vi.mock('@api/store.ts', () => ({
	useApiStore: () => ({
		getPosts,
	}),
}));

vi.mock('@api/http-error.ts', () => ({
	debugError,
}));

vi.mock('vue-router', async () => {
	const actual = await vi.importActual<typeof import('vue-router')>('vue-router');

	return {
		...actual,
		useRoute: () => reactive({ params: routeParams }),
	};
});

import TagPostsPage from '@pages/TagPostsPage.vue';

const ArticleItemPartialStub = defineComponent({
	name: 'ArticleItemPartialStub',
	props: {
		item: {
			type: Object,
			required: true,
		},
	},
	template: '<div class="article-item-stub" data-testid="article-item-stub">{{ item.title }}</div>',
});

const ArticleItemSkeletonPartialStub = defineComponent({
	name: 'ArticleItemSkeletonPartialStub',
	template: '<div class="article-item-skeleton-stub" data-testid="article-item-skeleton-stub"></div>',
});

const mountedWrappers: VueWrapper[] = [];

const mountComponent = () => {
	const wrapper = mount(TagPostsPage, {
		global: {
			stubs: {
				SideNavPartial: true,
				HeaderPartial: true,
				FooterPartial: true,
				WidgetSponsorPartial: true,
				WidgetSocialTransitionWrapper: true,
				BackToTopLink: true,
				RouterLink: true,
				ArticleItemPartial: ArticleItemPartialStub,
				ArticleItemSkeletonPartial: ArticleItemSkeletonPartialStub,
			},
		},
	});

	mountedWrappers.push(wrapper);
	return wrapper;
};

describe('TagPostsPage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		routeParams.tag = 'design';
		getPosts.mockResolvedValue(buildCollection(posts));
	});

	afterEach(() => {
		while (mountedWrappers.length > 0) {
			mountedWrappers.pop()?.unmount();
		}
	});

	it('fetches posts for the provided tag', async () => {
		const wrapper = mountComponent();

		expect(getPosts).toHaveBeenCalledWith({ tag: 'design' });

		await flushPromises();

		const renderedPosts = wrapper.findAll('[data-testid="article-item-stub"]');
		expect(renderedPosts).toHaveLength(posts.length);
		const summary = wrapper.get('[data-testid="tag-posts-summary"]');
		expect(summary.text()).toContain('2 posts found for #DESIGN');
	});

	it('shows an empty message when no posts are returned', async () => {
		getPosts.mockResolvedValueOnce(buildCollection([]));

		const wrapper = mountComponent();
		await flushPromises();

		expect(wrapper.find('[data-testid="tag-posts-list"]').exists()).toBe(false);
		const emptyState = wrapper.get('[data-testid="tag-posts-empty"]');
		expect(emptyState.text()).toContain('No posts found for #DESIGN');
	});

	it('handles API errors gracefully', async () => {
		const error = new Error('Network failure');
		getPosts.mockRejectedValueOnce(error);

		const wrapper = mountComponent();
		await flushPromises();

		expect(debugError).toHaveBeenCalledWith(error);
		const errorState = wrapper.get('[data-testid="tag-posts-error"]');
		expect(errorState.text()).toContain("We couldn't load posts for #DESIGN");
	});

	it('refetches posts when the route tag parameter changes', async () => {
		const wrapper = mountComponent();
		await flushPromises();

		const newPosts = [buildPost(3)];
		getPosts.mockResolvedValueOnce(buildCollection(newPosts));

		routeParams.tag = 'ux';
		await flushPromises();
		await flushPromises();

		expect(getPosts).toHaveBeenLastCalledWith({ tag: 'ux' });
		const summary = wrapper.get('[data-testid="tag-posts-summary"]');
		expect(summary.text()).toContain('1 post found for #UX');
	});
});
