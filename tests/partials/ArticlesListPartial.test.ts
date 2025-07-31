import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { faker } from '@faker-js/faker';
import ArticlesListPartial from '@partials/ArticlesListPartial.vue';

const posts = [{
  uuid: faker.string.uuid(),
  slug: faker.lorem.slug(),
  title: faker.lorem.words(2),
  excerpt: faker.lorem.sentence(),
  cover_image_url: faker.image.url(),
  published_at: faker.date.past().toISOString(),
}];
const categories = [{ uuid: faker.string.uuid(), slug: 'all', name: 'All' }];
const getPosts = vi.fn(() => Promise.resolve({ data: posts }));
const getCategories = vi.fn(() => Promise.resolve({ data: categories }));

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
    await nextTick();
    await nextTick();
    expect(getCategories).toHaveBeenCalled();
    expect(getPosts).toHaveBeenCalled();
    expect(wrapper.findAllComponents({ name: 'ArticleItemPartial' }).length).toBe(1);
  });
});
