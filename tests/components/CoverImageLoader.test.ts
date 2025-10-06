import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CoverImageLoader from '@/components/CoverImageLoader.vue';

describe('CoverImageLoader', () => {
	it('shows skeleton until the image loads', async () => {
		const wrapper = mount(CoverImageLoader, {
			props: {
				src: 'https://example.com/cover.jpg',
				alt: 'Cover image',
				width: 800,
				height: 600,
			},
		});

		const container = wrapper.find('div.relative');
		expect(container.classes()).toContain('animate-pulse');

		const image = wrapper.find('img');
		expect(image.exists()).toBe(true);
		expect(image.classes()).toContain('opacity-0');

		await image.trigger('load');

		expect(container.classes()).not.toContain('animate-pulse');
		expect(wrapper.find('img').classes()).toContain('opacity-100');
		expect(wrapper.find('.absolute.inset-0.flex').exists()).toBe(false);
	});

	it('displays the error state when loading fails', async () => {
		const wrapper = mount(CoverImageLoader, {
			props: {
				src: 'https://example.com/fail.jpg',
				alt: 'Broken image',
			},
		});

		const image = wrapper.find('img');
		expect(image.exists()).toBe(true);

		await image.trigger('error');

		expect(wrapper.find('img').exists()).toBe(false);
		expect(wrapper.find('svg').exists()).toBe(true);
		expect(wrapper.find('.absolute.inset-0.flex').exists()).toBe(true);
	});
});
