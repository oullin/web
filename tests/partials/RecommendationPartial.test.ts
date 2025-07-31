import { mount } from '@vue/test-utils';
import RecommendationPartial from '@partials/RecommendationPartial.vue';

vi.mock('@/public.ts', () => ({
  image: (p: string) => `/img/${p}`,
  date: () => ({ format: () => 'now' }),
}));

describe('RecommendationPartial', () => {
  const data = [{
    uuid: '1',
    relation: 'friend',
    text: '**great**',
    created_at: '2020-01-01',
    person: { full_name: 'Joe', company: 'ACME', avatar: 'a.png' },
  }] as any;

  it('sanitises and formats recommendation', () => {
    const wrapper = mount(RecommendationPartial, { props: { recommendations: data } });
    expect(wrapper.html()).toContain('<strong>great</strong>');
    expect(wrapper.text()).toContain('now');
  });
});
