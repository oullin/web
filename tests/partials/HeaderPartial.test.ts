import { mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import HeaderPartial from '@partials/HeaderPartial.vue';

const toggleDarkMode = vi.fn();
vi.mock('@/dark-mode.ts', () => ({ useDarkMode: () => ({ toggleDarkMode }) }));

const setSearchTerm = vi.fn();
vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ setSearchTerm }) }));

describe('HeaderPartial', () => {
  it('validates search length', () => {
    const wrapper = mount(HeaderPartial);
    wrapper.vm.searchQuery = 'abc';
    wrapper.vm.performSearch();
    expect(wrapper.vm.validationError).toBeDefined();
    expect(setSearchTerm).not.toHaveBeenCalled();
  });

  it('submits valid search', () => {
    const wrapper = mount(HeaderPartial);
    const query: string = faker.lorem.words(2);
    wrapper.vm.searchQuery = query;
    wrapper.vm.performSearch();
    expect(setSearchTerm).toHaveBeenCalledWith(query);
  });

  it('toggles dark mode', () => {
    const wrapper = mount(HeaderPartial);
    wrapper.find('label[for="light-switch"]').trigger('click');
    expect(toggleDarkMode).toHaveBeenCalled();
  });
});
