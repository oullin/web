import { mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { nextTick } from 'vue';
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
                await nextTick();
                expect(document.body.textContent).toContain(skills[0].item);

                await div.trigger('mouseleave');
                await nextTick();
                expect(document.body.textContent).not.toContain(skills[0].item);
        });
});
