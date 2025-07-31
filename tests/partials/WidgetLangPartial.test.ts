import { mount } from '@vue/test-utils';
import WidgetLangPartial from '@partials/WidgetLangPartial.vue';

describe('WidgetLangPartial', () => {
  it('renders language list', () => {
    const wrapper = mount(WidgetLangPartial);
    expect(wrapper.findAll('li').length).toBe(2);
  });
});
