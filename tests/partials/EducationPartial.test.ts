import { mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import EducationPartial from '@partials/EducationPartial.vue';

const education = [
  {
    uuid: faker.string.uuid(),
    degree: faker.word.words(1),
    school: faker.company.name(),
    graduated_at: '2020',
    description: '**hi**',
  },
] as any;

describe('EducationPartial', () => {
  it('renders markdown as html', () => {
    const wrapper = mount(EducationPartial, { props: { education } });
    expect(wrapper.html()).toContain('<strong>hi</strong>');
  });
});
