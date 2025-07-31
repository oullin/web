import { mount, flushPromises } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import ArticlesListPartial from '@partials/ArticlesListPartial.vue';
import type {
        PostResponse,
        PostsAuthorResponse,
        PostsCategoryResponse,
        PostsTagResponse,
        PostsCollectionResponse,
        CategoryResponse,
        CategoriesCollectionResponse,
} from '@api/response/index.ts';

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

const posts: PostResponse[] = [
        {
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
        },
];
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

const getPosts = vi.fn<[], Promise<PostsCollectionResponse>>(() =>
        Promise.resolve(postsCollection),
);
const getCategories = vi.fn<[], Promise<CategoriesCollectionResponse>>(() =>
        Promise.resolve(categoriesCollection),
);

vi.mock('@api/store.ts', () => ({
	useApiStore: () => ({
		getPosts,
		getCategories,
		searchTerm: '',
	}),
}));

describe('ArticlesListPartial', () => {
	it('loads posts on mount', async () => {
		const wrapper = mount(ArticlesListPartial);
		await flushPromises();
		expect(getCategories).toHaveBeenCalled();
		expect(getPosts).toHaveBeenCalled();
		const items = wrapper.findAllComponents({ name: 'ArticleItemPartial' });
		expect(items).toHaveLength(1);
		expect(wrapper.text()).toContain(posts[0].title);
	});
});
