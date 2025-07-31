import { mount, flushPromises } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi } from 'vitest';
import TalksPartial from '@partials/TalksPartial.vue';
import type { ApiResponse, TalksResponse } from '@api/response/index.ts';

const talks: TalksResponse[] = [
        {
                uuid: faker.string.uuid(),
                title: faker.lorem.word(),
                subject: faker.lorem.words(2),
		location: faker.location.city(),
		url: faker.internet.url(),
		photo: faker.image.urlPicsumPhotos(),
		created_at: faker.date.past().toISOString(),
		updated_at: faker.date.recent().toISOString(),
	},
];
const getTalks = vi.fn<[], Promise<ApiResponse<TalksResponse[]>>>(() =>
        Promise.resolve({ version: '1.0.0', data: talks }),
);
vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getTalks }) }));

describe('TalksPartial', () => {
        it('loads talks on mount', async () => {
                const wrapper = mount(TalksPartial);
                await flushPromises();

                expect(getTalks).toHaveBeenCalledTimes(1);
                const anchor = wrapper.find('a');
                expect(anchor.exists()).toBe(true);
                expect(anchor.attributes('href')).toBe(talks[0].url);
                expect(anchor.text()).toContain(talks[0].title);
                expect(wrapper.text()).toContain(talks[0].subject);
                expect(wrapper.text()).toContain(talks[0].location);
        });
});
