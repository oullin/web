import { mount, flushPromises } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import WidgetSocialPartial from '@partials/WidgetSocialPartial.vue';
import type { SocialResponse } from '@api/response/index.ts';
import { useApiStore } from '@api/store.ts';

const social: SocialResponse[] = [
	{
		uuid: faker.string.uuid(),
		name: 'github',
		handle: faker.internet.userName(),
		url: faker.internet.url(),
		description: faker.lorem.words(2),
	},
];

describe('WidgetSocialPartial', () => {
	it('fetches social links', async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const apiStore = useApiStore(pinia);
		apiStore.social = [];

		const fetchSocialMock = vi.spyOn(apiStore, 'fetchSocial').mockImplementation(async () => {
			apiStore.social = social;

			return apiStore.social;
		});

		const wrapper = mount(WidgetSocialPartial, { global: { plugins: [pinia] } });

		await flushPromises();

		expect(fetchSocialMock).toHaveBeenCalled();

		const anchors = wrapper.findAll('a');
		expect(anchors).toHaveLength(1);
		expect(anchors[0].attributes('href')).toBe(social[0].url);
		expect(anchors[0].text()).toContain('Code & Projects');
	});
});
