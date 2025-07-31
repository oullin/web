import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import TalksPartial from '@partials/TalksPartial.vue';

const getTalks = vi.fn(() => Promise.resolve({ data: [{ uuid:'1', title:'t', url:'/', photo:'a.jpg' }] }));
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
