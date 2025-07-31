import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import WidgetSocialPartial from '@partials/WidgetSocialPartial.vue';

const social = [{ uuid:'1', name:'x', url:'/', description:'desc' }];
const getSocial = vi.fn(() => Promise.resolve({ data: social }));
vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getSocial }) }));

describe('WidgetSocialPartial', () => {
  it('fetches social links', async () => {
    const wrapper = mount(WidgetSocialPartial);
    await nextTick();
    await nextTick();
    expect(getSocial).toHaveBeenCalled();
    expect(wrapper.findAll('a').length).toBe(1);
  });
});
