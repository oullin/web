import { mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect } from 'vitest';
import WidgetSkillsPartial from '@partials/WidgetSkillsPartial.vue';
import type { ProfileSkillResponse } from '@api/response/index.ts';

const skills: ProfileSkillResponse[] = [
	{
		uuid: faker.string.uuid(),
		item: faker.lorem.word(),
		percentage: 80,
		description: faker.lorem.sentence(),
	},
];

describe('WidgetSkillsPartial', () => {
	it('renders skill name in trigger', () => {
		const wrapper = mount(WidgetSkillsPartial, { props: { skills } });
		const trigger = wrapper.find(`[data-testid="skill-name-trigger-${skills[0].uuid}"]`);
		expect(trigger.exists()).toBe(true);
		expect(trigger.text()).toContain(skills[0].item);
	});
});
