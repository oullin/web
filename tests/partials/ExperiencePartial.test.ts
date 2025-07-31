import { mount } from '@vue/test-utils';
import ExperiencePartial from '@partials/ExperiencePartial.vue';

const experience = [
  { uuid:'1', start_date:'2020', end_date:'2021', position:'Dev', company:'ACME', summary:'sum', skills:'js' }
] as any;

describe('ExperiencePartial', () => {
  it('renders each experience item', () => {
    const wrapper = mount(ExperiencePartial, { props:{ experience } });
    expect(wrapper.findAll('li').length).toBe(1);
  });
});
