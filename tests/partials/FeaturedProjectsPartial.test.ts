import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { faker } from '@faker-js/faker';
import FeaturedProjectsPartial from '@partials/FeaturedProjectsPartial.vue';

const projects = [
  { uuid: faker.string.uuid(), title: faker.lorem.words(1), excerpt: '', url: '/' },
  { uuid: faker.string.uuid(), title: faker.lorem.words(1), excerpt: '', url: '/' },
  { uuid: faker.string.uuid(), title: faker.lorem.words(1), excerpt: '', url: '/' },
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
