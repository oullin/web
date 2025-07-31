import { mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
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
	it('shows tooltip on hover', async () => {
		const wrapper = mount(WidgetSkillsPartial, { props: { skills } });
		const div = wrapper.find('li div');
		await div.trigger('mouseenter');
		const vm = wrapper.vm as unknown as { tooltip: { show: boolean } };
		expect(vm.tooltip.show).toBe(true);
		await div.trigger('mouseleave');
		expect(vm.tooltip.show).toBe(false);
	});
});
