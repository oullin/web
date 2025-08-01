import { mount, flushPromises } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi } from 'vitest';
import WidgetSocialPartial from '@partials/WidgetSocialPartial.vue';
import type { SocialResponse } from '@api/response/index.ts';

const social: SocialResponse[] = [
	{
		uuid: faker.string.uuid(),
		name: 'github',
		handle: faker.internet.userName(),
		url: faker.internet.url(),
		description: faker.lorem.words(2),
	},
];
import type { ApiResponse } from '@api/response/index.ts';

const getSocial = vi.fn<[], Promise<ApiResponse<SocialResponse[]>>>(() => Promise.resolve({ version: '1.0.0', data: social }));
vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getSocial }) }));

describe('WidgetSocialPartial', () => {
	it('fetches social links', async () => {
		const wrapper = mount(WidgetSocialPartial);
		await flushPromises();
		expect(getSocial).toHaveBeenCalled();
		const anchors = wrapper.findAll('a');
		expect(anchors).toHaveLength(1);
		expect(anchors[0].attributes('href')).toBe(social[0].url);
		expect(anchors[0].text()).toContain('Follow me on GitHub');
	});
});
