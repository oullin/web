import { mount, flushPromises } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import WidgetSocialPartial from '@partials/WidgetSocialPartial.vue';
import type { SocialResponse } from '@api/response/index.ts';

const social: SocialResponse[] = [
	{
		uuid: faker.string.uuid(),
		name: 'github',
		url: faker.internet.url(),
		description: faker.lorem.words(2),
	},
];
const getSocial = vi.fn(() => Promise.resolve({ data: social }));
vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getSocial }) }));

describe('WidgetSocialPartial', () => {
	it('fetches social links', async () => {
		const wrapper = mount(WidgetSocialPartial);
		await flushPromises();
		expect(getSocial).toHaveBeenCalled();
		const anchors = wrapper.findAll('a');
		expect(anchors).toHaveLength(1);
		expect(anchors[0].attributes('href')).toBe(social[0].url);
	});
});
