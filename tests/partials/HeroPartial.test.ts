import { mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HeroPartial from '@partials/HeroPartial.vue';
import AvatarPartial from '@partials/AvatarPartial.vue';
import { useHeaderSocialLinks } from '@/support/social.ts';
import { ref } from 'vue';

const socialLinks = [
	{
		uuid: faker.string.uuid(),
		handle: faker.internet.userName(),
		url: faker.internet.url(),
		description: 'Custom LinkedIn description',
		name: 'linkedin',
	},
	{
		uuid: faker.string.uuid(),
		handle: faker.internet.userName(),
		url: faker.internet.url(),
		description: 'Custom GitHub description',
		name: 'github',
	},
];

const getSocial = vi.fn(() => Promise.resolve({ version: '1.0.0', data: socialLinks }));
const debugError = vi.fn();

vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getSocial }) }));
vi.mock('@api/http-error.ts', () => ({ debugError }));

describe('HeroPartial', () => {
	beforeEach(() => {
		getSocial.mockClear();
		debugError.mockClear();
	});

	it('renders avatar', () => {
		const wrapper = mount(HeroPartial);
		expect(wrapper.findComponent(AvatarPartial).exists()).toBe(true);
	});

	it('loads social links and renders them', async () => {
		const wrapper = mount(HeroPartial);

		await wrapper.vm.$nextTick();
		await Promise.resolve();

		expect(getSocial).toHaveBeenCalled();
		expect(debugError).not.toHaveBeenCalled();

		const links = wrapper.findAll('a[rel="noopener noreferrer"]');
		const helperLinks = useHeaderSocialLinks(ref(socialLinks)).value;

		expect(links).toHaveLength(2);
		expect(links[0].attributes('href')).toBe(helperLinks[0]?.url);
		expect(links[1].attributes('href')).toBe(helperLinks[1]?.url);
		expect(links[0].attributes('title')).toBe(helperLinks[0]?.title);
		expect(links[1].attributes('title')).toBe(helperLinks[1]?.title);
		expect(links[0].find('span.sr-only').text()).toBe(helperLinks[0]?.label);
		expect(links[1].find('span.sr-only').text()).toBe(helperLinks[1]?.label);
		expect(links[0].find('svg').classes()).toContain('blog-widgets-social-svg');
		expect(links[1].find('svg').classes()).toContain('blog-widgets-social-svg');
	});

	it('handles social loading failures', async () => {
		const error = new Error('Network error');
		getSocial.mockRejectedValueOnce(error);

		mount(HeroPartial);

		await Promise.resolve();

		expect(debugError).toHaveBeenCalledWith(error);
	});
});
