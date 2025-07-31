import { mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import HeaderPartial from '@partials/HeaderPartial.vue';

const toggleDarkMode = vi.fn();
vi.mock('@/dark-mode.ts', () => ({ useDarkMode: () => ({ toggleDarkMode }) }));

const setSearchTerm = vi.fn();
vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ setSearchTerm }) }));

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
});
