import { mount } from '@vue/test-utils';
import ArticleItemPartial from '@partials/ArticleItemPartial.vue';

vi.mock('@/public.ts', () => ({
  date: () => ({ format: () => 'formatted' })
}));

describe('ArticleItemPartial', () => {
  const item = {
    uuid: '1',
    slug: 'test',
    title: 'My Post',
    excerpt: 'excerpt',
    cover_image_url: '/img.png',
    published_at: '2020-01-01',
  } as any;

  it('renders item information', () => {
    const wrapper = mount(ArticleItemPartial, { props: { item } });
    expect(wrapper.text()).toContain('formatted');
    expect(wrapper.text()).toContain('My Post');
    expect(wrapper.find('img').attributes('src')).toBe('/img.png');
  });
});
