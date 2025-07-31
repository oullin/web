import { mount } from '@vue/test-utils';
import EducationPartial from '@partials/EducationPartial.vue';

const education = [
  { uuid: '1', degree: 'BSc', school: 'U', graduated_at: '2020', description: '**hi**' }
] as any;

describe('EducationPartial', () => {
  it('renders markdown as html', () => {
    const wrapper = mount(EducationPartial, { props: { education } });
    expect(wrapper.html()).toContain('<strong>hi</strong>');
  });
});
