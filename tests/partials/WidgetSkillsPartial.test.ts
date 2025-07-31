import { mount } from '@vue/test-utils';
import WidgetSkillsPartial from '@partials/WidgetSkillsPartial.vue';

const skills = [{ uuid: '1', item: 'Vue', percentage: 80 }];

describe('WidgetSkillsPartial', () => {
  it('shows tooltip on hover', async () => {
    const wrapper = mount(WidgetSkillsPartial, { props: { skills } });
    const div = wrapper.find('li div');
    await div.trigger('mouseenter');
    expect((wrapper.vm as any).tooltip.show).toBe(true);
    await div.trigger('mouseleave');
    expect((wrapper.vm as any).tooltip.show).toBe(false);
  });
});
