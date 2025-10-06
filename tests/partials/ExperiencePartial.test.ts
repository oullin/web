import { mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect } from 'vitest';
import ExperiencePartial from '@partials/ExperiencePartial.vue';
import type { ExperienceResponse } from '@api/response/index.ts';

const experience: ExperienceResponse[] = [
	{
		uuid: faker.string.uuid(),
		start_date: faker.date.past().getFullYear().toString(),
		end_date: faker.date.recent().getFullYear().toString(),
		position: faker.person.jobTitle(),
		company: faker.company.name(),
		summary: faker.lorem.sentence(),
		skills: faker.lorem.word(),
		employment_type: faker.lorem.word(),
		location_type: faker.lorem.word(),
		country: faker.location.country(),
		city: faker.location.city(),
	},
];

describe('ExperiencePartial', () => {
	it('renders each experience item', () => {
		const wrapper = mount(ExperiencePartial, { props: { experience, backToTopTarget: '#top' } });
		const items = wrapper.findAll('li');
		expect(items).toHaveLength(1);
		expect(items[0].text()).toContain(experience[0].company);
	});
});
