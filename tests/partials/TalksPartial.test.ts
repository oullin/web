import { mount, flushPromises } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import TalksPartial from '@partials/TalksPartial.vue';
import type { TalksResponse } from '@api/response/index.ts';

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
const getTalks = vi.fn(() => Promise.resolve({ data: talks }));
vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getTalks }) }));

describe('TalksPartial', () => {
	it('loads talks on mount', async () => {
		const wrapper = mount(TalksPartial);
		await flushPromises();
		expect(getTalks).toHaveBeenCalled();
		const anchor = wrapper.find('a');
		expect(anchor.exists()).toBe(true);
		expect(anchor.text()).toContain(talks[0].title);
	});
});
