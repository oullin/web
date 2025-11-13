import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { defineComponent } from 'vue';
import { faker } from '@faker-js/faker';
import TagPostsPage from '@pages/TagPostsPage.vue';
import type { PostResponse, PostsCollectionResponse } from '@api/response/index.ts';

const tagValue = faker.lorem.word();

const post: PostResponse = {
	uuid: faker.string.uuid(),
	slug: faker.lorem.slug(),
	title: faker.lorem.words(4),
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

const collection: PostsCollectionResponse = {
	data: [post],
	page: 1,
	total: 1,
	page_size: 10,
	total_pages: 1,
};

const getPosts = vi.fn<[], Promise<PostsCollectionResponse>>(() => Promise.resolve(collection));

vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getPosts }) }));

const mockRoute = { params: { tag: encodeURIComponent(tagValue) } };

vi.mock('vue-router', () => ({
	useRoute: () => mockRoute,
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
	template: '<a :href="typeof to === \'string\' ? to : \"#\"" @click="$emit(\'click\', $event)"><slot /></a>',
});

const ArticleItemPartialStub = defineComponent({
	name: 'ArticleItemPartialStub',
	props: {
		item: {
			type: Object,
			required: true,
		},
	},
	template: '<article data-testid="article-item">{{ item.title }}</article>',
});

const ArticleItemSkeletonPartialStub = defineComponent({
	name: 'ArticleItemSkeletonPartialStub',
	template: '<div data-testid="article-item-skeleton"></div>',
});

const debugError = vi.fn();

vi.mock('@api/http-error.ts', () => ({ debugError }));

const mountComponent = () =>
	mount(TagPostsPage, {
		global: {
			stubs: {
				SideNavPartial: true,
				HeaderPartial: true,
				FooterPartial: true,
				WidgetSocialPartial: true,
				WidgetSponsorPartial: true,
				ArticleItemPartial: ArticleItemPartialStub,
				ArticleItemSkeletonPartial: ArticleItemSkeletonPartialStub,
				BackToTopLink: true,
				RouterLink: RouterLinkStub,
			},
		},
	});

describe('TagPostsPage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockRoute.params.tag = encodeURIComponent(tagValue);
	});

	it('fetches posts for the provided tag', async () => {
		const wrapper = mountComponent();
		await flushPromises();
		expect(getPosts).toHaveBeenCalledWith({ tag: tagValue });
		expect(wrapper.text()).toContain(`#${tagValue.toUpperCase()}`);
		const articles = wrapper.findAll('[data-testid="article-item"]');
		expect(articles).toHaveLength(collection.data.length);
		expect(articles[0]?.text()).toContain(post.title);
	});

	it('renders an empty state when no posts are returned', async () => {
		getPosts.mockResolvedValueOnce({ ...collection, data: [] });
		const wrapper = mountComponent();
		await flushPromises();
		expect(wrapper.text()).toContain('No posts found for this tag.');
	});

	it('logs errors when fetching posts fails', async () => {
		const error = new Error('failed to load');
		getPosts.mockRejectedValueOnce(error);
		const wrapper = mountComponent();
		await flushPromises();
		expect(debugError).toHaveBeenCalledWith(error);
		expect(wrapper.text()).toContain('No posts found for this tag.');
	});
});
