import { mount } from '@vue/test-utils';
import ProjectCardPartial from '@partials/ProjectCardPartial.vue';

vi.mock('@/public.ts', () => ({
  image: (p: string) => `/img/${p}`,
  getRandomInt: () => 6,
}));

describe('ProjectCardPartial', () => {
  const item = { uuid: '1', title: 'x', excerpt: '', url: '/', is_open_source: false } as any;

  it('uses random icon path', () => {
    const wrapper = mount(ProjectCardPartial, { props: { item } });
    expect(wrapper.find('img').attributes('src')).toBe('/img/icons/icon-06.svg');
  });
});
