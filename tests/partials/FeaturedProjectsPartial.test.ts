import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import FeaturedProjectsPartial from '@partials/FeaturedProjectsPartial.vue';

const projects = [
  { uuid:'1', title:'A', excerpt:'', url:'/' },
  { uuid:'2', title:'B', excerpt:'', url:'/' },
  { uuid:'3', title:'C', excerpt:'', url:'/' }
];
const getProjects = vi.fn(() => Promise.resolve({ data: projects }));

vi.mock('@api/store.ts', () => ({
  useApiStore: () => ({ getProjects })
}));

describe('FeaturedProjectsPartial', () => {
  it('fetches projects on mount and limits to two', async () => {
    const wrapper = mount(FeaturedProjectsPartial);
    await nextTick();
    await nextTick();
    expect(getProjects).toHaveBeenCalled();
    expect(wrapper.findAll('a').length).toBe(2);
  });
});
