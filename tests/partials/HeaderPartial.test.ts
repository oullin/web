import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi } from 'vitest';
import HeaderPartial from '@partials/HeaderPartial.vue';
import { useHeaderSocialLinks } from '@/support/social.ts';

const toggleDarkMode = vi.fn();
vi.mock('@/dark-mode.ts', () => ({ useDarkMode: () => ({ toggleDarkMode }) }));

const setSearchTerm = vi.fn();
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

vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ setSearchTerm, getSocial }) }));

vi.mock('@api/http-error.ts', () => ({ debugError: vi.fn() }));

describe('HeaderPartial', () => {
	it('validates search length', async () => {
		const wrapper = mount(HeaderPartial);
		const input = wrapper.find('#search');
		await input.setValue('abc');
		await wrapper.find('form').trigger('submit');
		expect(wrapper.vm.validationError).toBeDefined();
		expect(setSearchTerm).not.toHaveBeenCalled();
	});

	it('submits valid search', async () => {
		const wrapper = mount(HeaderPartial);
		const query: string = faker.lorem.words(2);
		const input = wrapper.find('#search');
		await input.setValue(query);
		await wrapper.find('form').trigger('submit');
		expect(setSearchTerm).toHaveBeenCalledWith(query);
	});

	it('toggles dark mode', () => {
		const wrapper = mount(HeaderPartial);
		wrapper.find('label[for="light-switch"]').trigger('click');
		expect(toggleDarkMode).toHaveBeenCalled();
	});

	it('renders social links provided by the api store', async () => {
		const wrapper = mount(HeaderPartial);

		await wrapper.vm.$nextTick();
		await Promise.resolve();

		const links = wrapper.findAll('a[rel="noopener noreferrer"]');

		const githubLink = socialLinks.find((item) => item.name === 'github');
		const linkedinLink = socialLinks.find((item) => item.name === 'linkedin');
		const helperLinks = useHeaderSocialLinks(ref(socialLinks)).value;

		expect(links).toHaveLength(2);
		expect(links[0].attributes('href')).toBe(githubLink?.url);
		expect(links[1].attributes('href')).toBe(linkedinLink?.url);
		expect(links[0].attributes('title')).toBe(githubLink?.description);
		expect(links[0].find('span.sr-only').text()).toBe(githubLink?.description);
		expect(links[1].attributes('title')).toBe(linkedinLink?.description);
		expect(links[1].find('span.sr-only').text()).toBe(linkedinLink?.description);
		expect(links[0].find('path').attributes('d')).toBe(helperLinks[0]?.icon);
		expect(links[1].find('path').attributes('d')).toBe(helperLinks[1]?.icon);
	});
});
