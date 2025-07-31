import { mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import ExperiencePartial from '@partials/ExperiencePartial.vue';

const experience = [
  {
    uuid: faker.string.uuid(),
    start_date: faker.date.past().getFullYear().toString(),
    end_date: faker.date.recent().getFullYear().toString(),
    position: faker.person.jobTitle(),
    company: faker.company.name(),
    summary: faker.lorem.sentence(),
    skills: faker.lorem.word(),
  },
] as any;

describe('ExperiencePartial', () => {
  it('renders each experience item', () => {
    const wrapper = mount(ExperiencePartial, { props:{ experience } });
    expect(wrapper.findAll('li').length).toBe(1);
  });
});
