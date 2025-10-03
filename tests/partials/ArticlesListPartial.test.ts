import { mount, flushPromises } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { reactive, ref, nextTick } from 'vue';
import ArticlesListPartial from '@partials/ArticlesListPartial.vue';
import type { PostResponse, PostsAuthorResponse, PostsCategoryResponse, PostsTagResponse, PostsCollectionResponse, CategoryResponse, CategoriesCollectionResponse } from '@api/response/index.ts';

const author: PostsAuthorResponse = {
	uuid: faker.string.uuid(),
	first_name: faker.person.firstName(),
	last_name: faker.person.lastName(),
	username: faker.internet.userName(),
	display_name: faker.person.fullName(),
	bio: faker.lorem.sentence(),
	picture_file_name: faker.system.fileName(),
	profile_picture_url: faker.image.url(),
};

const postCategory: PostsCategoryResponse = {
	uuid: faker.string.uuid(),
	name: faker.lorem.word(),
	slug: faker.lorem.slug(),
	description: faker.lorem.sentence(),
};

const postTag: PostsTagResponse = {
	uuid: faker.string.uuid(),
	name: faker.lorem.word(),
	description: faker.lorem.sentence(),
};

const posts: PostResponse[] = Array.from({ length: 3 }, () => ({
	uuid: faker.string.uuid(),
	slug: faker.lorem.slug(),
	title: faker.lorem.words(2),
	excerpt: faker.lorem.sentence(),
	content: faker.lorem.paragraph(),
	cover_image_url: faker.image.url(),
	published_at: faker.date.past().toISOString(),
	created_at: faker.date.past().toISOString(),
	updated_at: faker.date.recent().toISOString(),
	author,
	categories: [postCategory],
	tags: [postTag],
}));
const categories: CategoryResponse[] = [
	{
		uuid: faker.string.uuid(),
		slug: 'all',
		name: 'All',
		description: faker.lorem.sentence(),
	},
];

const postsCollection: PostsCollectionResponse = {
	page: 1,
	total: posts.length,
	page_size: 5,
	total_pages: 1,
	data: posts,
};

const categoriesCollection: CategoriesCollectionResponse = {
	page: 1,
	total: categories.length,
	page_size: 5,
	total_pages: 1,
	data: categories,
};

const getPosts = vi.fn<[], Promise<PostsCollectionResponse>>();
const getCategories = vi.fn<[], Promise<CategoriesCollectionResponse>>();
const searchTerm = ref('');

const apiStoreMock = reactive({
	getPosts,
	getCategories,
	get searchTerm() {
		return searchTerm.value;
	},
	set searchTerm(value: string) {
		searchTerm.value = value;
	},
});

vi.mock('@api/store.ts', () => ({
	useApiStore: () => apiStoreMock,
}));

describe('ArticlesListPartial', () => {
	beforeEach(() => {
		getPosts.mockReset();
		getCategories.mockReset();
		apiStoreMock.searchTerm = '';
		getCategories.mockResolvedValue(categoriesCollection);
	});

	const globalMountOptions = {
		global: {
			stubs: { RouterLink: { template: '<a><slot /></a>' } },
			directives: {
				'lazy-link': {
					mounted() {},
					updated() {},
				},
			},
		},
	};

	it('renders skeletons while loading posts', async () => {
		let resolvePosts: (value: PostsCollectionResponse) => void = () => {};
		getPosts.mockImplementationOnce(
			() =>
				new Promise<PostsCollectionResponse>((resolve) => {
					resolvePosts = resolve;
				}),
		);

		const wrapper = mount(ArticlesListPartial, globalMountOptions);

		await flushPromises();

		expect(getCategories).toHaveBeenCalled();
		expect(getPosts).toHaveBeenCalled();

		const skeletons = wrapper.findAllComponents({ name: 'ArticleItemSkeletonPartial' });
		expect(skeletons).toHaveLength(3);

		resolvePosts(postsCollection);
		await flushPromises();

		const itemsAfterLoad = wrapper.findAllComponents({ name: 'ArticleItemPartial' });
		expect(itemsAfterLoad).toHaveLength(posts.length);
	});

	it('loads posts on mount', async () => {
		getPosts.mockResolvedValue(postsCollection);

		const wrapper = mount(ArticlesListPartial, globalMountOptions);
		await flushPromises();
		expect(getCategories).toHaveBeenCalled();
		expect(getPosts).toHaveBeenCalled();
		const items = wrapper.findAllComponents({ name: 'ArticleItemPartial' });
		expect(items).toHaveLength(posts.length);
		expect(wrapper.text()).toContain(posts[0].title);
		const skeletons = wrapper.findAllComponents({ name: 'ArticleItemSkeletonPartial' });
		expect(skeletons).toHaveLength(0);
	});

	it('uses the previous result count while refreshing the list', async () => {
		getPosts.mockResolvedValueOnce(postsCollection).mockImplementationOnce(
			() =>
				new Promise<PostsCollectionResponse>((resolve) => {
					setTimeout(() => resolve(postsCollection), 0);
				}),
		);

		const wrapper = mount(ArticlesListPartial, globalMountOptions);

		await flushPromises();

		apiStoreMock.searchTerm = faker.lorem.word();
		await flushPromises();
		await nextTick();

		const skeletons = wrapper.findAllComponents({ name: 'ArticleItemSkeletonPartial' });
		expect(skeletons).toHaveLength(posts.length);
	});
});
