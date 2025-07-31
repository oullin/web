import { mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import ArticleItemPartial from '@partials/ArticleItemPartial.vue';

vi.mock('@/public.ts', () => ({
  date: () => ({ format: () => 'formatted' })
}));

describe('ArticleItemPartial', () => {
  const item = {
    uuid: faker.string.uuid(),
    slug: faker.lorem.slug(),
    title: faker.lorem.words(2),
    excerpt: faker.lorem.sentence(),
    cover_image_url: faker.image.url(),
    published_at: faker.date.past().toISOString(),
  } as any;

  it('renders item information', () => {
    const wrapper = mount(ArticleItemPartial, { props: { item } });
    expect(wrapper.text()).toContain('formatted');
    expect(wrapper.text()).toContain(item.title);
    expect(wrapper.find('img').attributes('src')).toBe(item.cover_image_url);
  });
});
