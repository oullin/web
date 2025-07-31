import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { faker } from '@faker-js/faker';
import TalksPartial from '@partials/TalksPartial.vue';
import type { TalksResponse } from '@api/response/index.ts';

const talks: TalksResponse[] = [{
  uuid: faker.string.uuid(),
  title: faker.lorem.word(),
  subject: '',
  location: '',
  url: '/',
  photo: faker.image.urlPicsumPhotos(),
  created_at: '',
  updated_at: '',
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
