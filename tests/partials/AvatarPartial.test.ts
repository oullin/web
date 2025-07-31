import { mount } from '@vue/test-utils';
import AvatarPartial from '@partials/AvatarPartial.vue';

describe('AvatarPartial', () => {
  it('applies default size classes', () => {
    const wrapper = mount(AvatarPartial);
    const img = wrapper.find('img');
    expect(img.classes()).toContain('w-20');
    expect(img.classes()).toContain('h-20');
  });

  it('accepts custom size classes', () => {
    const wrapper = mount(AvatarPartial, { props: { width: 'w-10', height: 'h-8' } });
    const img = wrapper.find('img');
    expect(img.classes()).toContain('w-10');
    expect(img.classes()).toContain('h-8');
  });
});
