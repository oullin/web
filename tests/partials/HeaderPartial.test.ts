import { mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { createRouter, createMemoryHistory } from 'vue-router';
import HeaderPartial from '@partials/HeaderPartial.vue';

const toggleDarkMode = vi.fn();
vi.mock('@/dark-mode.ts', () => ({ useDarkMode: () => ({ toggleDarkMode }) }));

const setSearchTerm = vi.fn();
vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ setSearchTerm }) }));

const routes = [
	{ path: '/', name: 'home', component: { template: '<div />' } },
	{ path: '/tags/:tag', name: 'TagPosts', component: { template: '<div />' } },
];

const mountWithRouter = async () => {
	const router = createRouter({ history: createMemoryHistory(), routes });
	router.push('/');
	await router.isReady();

	return mount(HeaderPartial, { global: { plugins: [router] } });
};

describe('HeaderPartial', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('validates search length', async () => {
		const wrapper = await mountWithRouter();
		const input = wrapper.find('#search');
		await input.setValue('abc');
		await wrapper.find('form').trigger('submit');
		expect(wrapper.vm.validationError).toBeTruthy();
		expect(setSearchTerm).not.toHaveBeenCalled();
	});

	it('submits valid search', async () => {
		const wrapper = await mountWithRouter();
		const query = 'valid search';
		const input = wrapper.find('#search');
		await input.setValue(query);
		await wrapper.find('form').trigger('submit');
		expect(setSearchTerm).toHaveBeenCalledWith(query);
	});

	it('toggles dark mode', async () => {
		const wrapper = await mountWithRouter();
		await wrapper.find('label[for="light-switch"]').trigger('click');
		expect(toggleDarkMode).toHaveBeenCalled();
	});
});
