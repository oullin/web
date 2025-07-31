import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import ArticlesListPartial from '@partials/ArticlesListPartial.vue';

const getPosts = vi.fn(() => Promise.resolve({ data: [{ uuid: '1', slug: 's', title: 't', excerpt: '', cover_image_url: '', published_at: '' }] }));
const getCategories = vi.fn(() => Promise.resolve({ data: [{ uuid: 'c1', slug: 'all', name: 'All' }] }));

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
