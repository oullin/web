import { mount, flushPromises } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { reactive } from 'vue';
import ArticlesListPartial from '@partials/ArticlesListPartial.vue';
import type { CategoriesCollectionResponse, CategoryResponse, PostResponse, PostsCollectionResponse, PostsFilters } from '@api/response/index.ts';

const createCategory = (): CategoryResponse => ({
	uuid: faker.string.uuid(),
	name: faker.lorem.words(2),
	slug: faker.lorem.slug(),
	description: faker.lorem.sentence(),
});

const createPost = (): PostResponse => ({
	uuid: faker.string.uuid(),
	slug: faker.lorem.slug(),
	title: faker.lorem.words(3),
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
		profile_picture_url: faker.image.url(),
	},
	categories: [],
	tags: [],
});

type DeferredPromise<T> = {
	promise: Promise<T>;
	resolve: (value: T) => void;
	reject: (reason?: unknown) => void;
};

const createDeferred = <T>(): DeferredPromise<T> => {
	let resolve!: (value: T) => void;
	let reject!: (reason?: unknown) => void;
	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});
	return { promise, resolve, reject };
};

let apiStore: any;
const cancelMock = vi.fn();
const debounceMock = vi.fn((fn: (...args: unknown[]) => unknown) => {
	const debounced = (...args: unknown[]) => fn(...args);
	(debounced as typeof debounced & { cancel: typeof cancelMock }).cancel = cancelMock;
	return debounced;
});

vi.mock('lodash/debounce', () => ({
	default: debounceMock,
}));

vi.mock('@api/http-error.ts', () => ({
	debugError: vi.fn(),
}));

vi.mock('@api/store.ts', () => ({
	useApiStore: () => apiStore,
}));

vi.mock('@partials/ArticleItemPartial.vue', () => ({
	default: {
		name: 'ArticleItemPartial',
		props: {
			item: {
				type: Object,
				required: true,
			},
		},
		template: '<div data-testid="article-item">{{ item.title }}</div>',
	},
}));

describe('ArticlesListPartial', () => {
	beforeEach(() => {
		cancelMock.mockClear();
		debounceMock.mockClear();
	});

	afterEach(() => {
		vi.clearAllMocks();
		apiStore = undefined;
	});

	const buildCategoriesResponse = (categories: CategoryResponse[]): CategoriesCollectionResponse => ({
		page: 1,
		total: categories.length,
		page_size: categories.length,
		total_pages: 1,
		data: categories,
	});

	const buildPostsResponse = (posts: PostResponse[]): PostsCollectionResponse => ({
		page: 1,
		total: posts.length,
		page_size: posts.length,
		total_pages: 1,
		data: posts,
	});

	it('fetches categories and posts on mount and renders articles', async () => {
		const categories = [createCategory(), createCategory()];
		const posts = [createPost(), createPost()];

		const getCategories = vi.fn<[], Promise<CategoriesCollectionResponse>>().mockResolvedValue(buildCategoriesResponse(categories));
		const getPosts = vi.fn<[PostsFilters], Promise<PostsCollectionResponse>>().mockResolvedValue(buildPostsResponse(posts));

		apiStore = reactive({
			searchTerm: '',
			getCategories,
			getPosts,
		});

		const wrapper = mount(ArticlesListPartial);
		await flushPromises();

		expect(getCategories).toHaveBeenCalledTimes(1);
		expect(getPosts).toHaveBeenCalledTimes(1);
		expect(getPosts.mock.calls[0][0]).toMatchObject({
			category: categories[0].slug,
			text: '',
		});

		const categoryLinks = wrapper.findAll('ul li a');
		expect(categoryLinks).toHaveLength(categories.length);
		expect(categoryLinks[0].classes()).toContain('text-slate-800');

		const articleItems = wrapper.findAll('[data-testid="article-item"]');
		expect(articleItems).toHaveLength(posts.length);
		expect(articleItems[0].text()).toContain(posts[0].title);
	});

	it('shows skeletons while loading new posts and updates results when the search term changes', async () => {
		const categories = [createCategory(), createCategory()];
		const firstPosts = [createPost(), createPost()];
		const nextPostsDeferred = createDeferred<PostsCollectionResponse>();
		const nextPosts = [createPost()];

		const getCategories = vi.fn<[], Promise<CategoriesCollectionResponse>>().mockResolvedValue(buildCategoriesResponse(categories));
		const getPosts = vi.fn<[PostsFilters], Promise<PostsCollectionResponse>>().mockResolvedValueOnce(buildPostsResponse(firstPosts)).mockReturnValueOnce(nextPostsDeferred.promise);

		apiStore = reactive({
			searchTerm: '',
			getCategories,
			getPosts,
		});

		const wrapper = mount(ArticlesListPartial);
		await flushPromises();

		expect(wrapper.findAll('[data-testid="article-item"]')).toHaveLength(firstPosts.length);

		apiStore.searchTerm = 'vue';
		await flushPromises();

		expect(cancelMock).toHaveBeenCalled();
		expect(getPosts).toHaveBeenCalledTimes(2);
		expect(wrapper.findAll('[data-testid="article-skeleton"]')).toHaveLength(firstPosts.length);
		expect(wrapper.findAll('[data-testid="article-item"]')).toHaveLength(0);

		nextPostsDeferred.resolve(buildPostsResponse(nextPosts));
		await flushPromises();

		expect(wrapper.findAll('[data-testid="article-skeleton"]')).toHaveLength(0);
		expect(wrapper.findAll('[data-testid="article-item"]')).toHaveLength(nextPosts.length);
		expect(wrapper.find('[data-testid="article-item"]').text()).toContain(nextPosts[0].title);
	});

	it('renders empty state when no posts are returned', async () => {
		const categories = [createCategory()];
		const getCategories = vi.fn<[], Promise<CategoriesCollectionResponse>>().mockResolvedValue(buildCategoriesResponse(categories));
		const getPosts = vi.fn<[PostsFilters], Promise<PostsCollectionResponse>>().mockResolvedValue(buildPostsResponse([]));

		apiStore = reactive({
			searchTerm: '',
			getCategories,
			getPosts,
		});

		const wrapper = mount(ArticlesListPartial);
		await flushPromises();

		expect(wrapper.text()).toContain('No articles found.');
	});
});
