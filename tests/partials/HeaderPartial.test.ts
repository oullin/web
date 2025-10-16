import { mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HeaderPartial from '@partials/HeaderPartial.vue';

const toggleDarkMode = vi.fn();
vi.mock('@/dark-mode.ts', () => ({ useDarkMode: () => ({ toggleDarkMode }) }));

const setSearchTerm = vi.fn();
vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ setSearchTerm }) }));

describe('HeaderPartial', () => {
	beforeEach(() => {
		setSearchTerm.mockClear();
		toggleDarkMode.mockClear();
	});

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

	it('renders light and dark mode icons', () => {
		const wrapper = mount(HeaderPartial);

		const themeIcons = wrapper.findAll('label[for="light-switch"] svg');

		expect(themeIcons).toHaveLength(2);
		themeIcons.forEach((icon) => {
			expect(icon.attributes('viewBox')).toBe('0 0 24 24');
		});
	});

	it('clears invalid searches and resets the store term', async () => {
		const wrapper = mount(HeaderPartial);
		const input = wrapper.find('#search');

		await input.setValue('abcd');
		await wrapper.find('form').trigger('submit');
		await wrapper.vm.$nextTick();

		expect(wrapper.vm.validationError).toBeDefined();
		expect(setSearchTerm).not.toHaveBeenCalled();

		const clearButton = wrapper.find('svg[title="Clear search"]');
		expect(clearButton.exists()).toBe(true);

		await clearButton.trigger('click');
		await wrapper.vm.$nextTick();
		await Promise.resolve();

		expect(wrapper.vm.validationError).toBe('');
		expect(wrapper.vm.searchQuery).toBe('');
		expect(setSearchTerm).toHaveBeenCalledWith('');
	});
});
