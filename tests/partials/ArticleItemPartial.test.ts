import { mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi } from 'vitest';
import ArticleItemPartial from '@partials/ArticleItemPartial.vue';
import CoverImageLoader from '@partials/CoverImageLoader.vue';
import type { PostResponse } from '@api/response/index.ts';

vi.mock('@/public.ts', () => ({
	date: () => ({ format: () => 'formatted' }),
}));

describe('ArticleItemPartial', () => {
	const item: PostResponse = {
		uuid: faker.string.uuid(),
		slug: faker.lorem.slug(),
		title: faker.lorem.words(2),
		excerpt: faker.lorem.sentence(),
		content: faker.lorem.paragraph(),
		cover_image_url: faker.image.url(),
		published_at: faker.date.past().toISOString(),
		created_at: faker.date.past().toISOString(),
		updated_at: faker.date.recent().toISOString(),
		author: {
			uuid: faker.string.uuid(),
			first_name: faker.person.firstName(),
			last_name: faker.person.lastName(),
			username: faker.internet.userName(),
			display_name: faker.person.fullName(),
			bio: faker.lorem.sentence(),
			picture_file_name: faker.system.fileName(),
			profile_picture_url: faker.image.url(),
		},
		categories: [],
		tags: [],
	};

	it('renders item information', () => {
		const wrapper = mount(ArticleItemPartial, {
			props: { item },
			global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
		});
		expect(wrapper.text()).toContain('formatted');
		expect(wrapper.text()).toContain(item.title);

		const coverLoader = wrapper.findComponent(CoverImageLoader);
		expect(coverLoader.exists()).toBe(true);
		expect(coverLoader.props('src')).toBe(item.cover_image_url);
		expect(coverLoader.props('alt')).toBe(item.title);
	});

	it('relies on the cover loader placeholder when no image url is provided', () => {
		const wrapper = mount(ArticleItemPartial, {
			props: {
				item: {
					...item,
					cover_image_url: undefined as unknown as string,
				} as PostResponse,
			},
			global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
		});

		const coverLoader = wrapper.findComponent(CoverImageLoader);
		expect(coverLoader.exists()).toBe(true);
		expect(coverLoader.props('src')).toBe('');

		const placeholderImage = coverLoader.find('img');
		expect(placeholderImage.exists()).toBe(true);
		expect(placeholderImage.attributes('src')).toContain('data:image/svg+xml');
	});
});
