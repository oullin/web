import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { faker } from '@faker-js/faker';
import TalksPartial from '@partials/TalksPartial.vue';

const talks = [{
  uuid: faker.string.uuid(),
  title: faker.lorem.word(),
  url: '/',
  photo: faker.image.urlPicsumPhotos(),
}];
const getTalks = vi.fn(() => Promise.resolve({ data: talks }));
vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getTalks }) }));

describe('TalksPartial', () => {
  it('loads talks on mount', async () => {
    const wrapper = mount(TalksPartial);
    await nextTick();
    await nextTick();
    expect(getTalks).toHaveBeenCalled();
    expect(wrapper.findAll('a').length).toBe(1);
  });
});
