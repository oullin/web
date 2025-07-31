import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { createRouter, createMemoryHistory } from 'vue-router';
import SideNavPartial from '@partials/SideNavPartial.vue';

const router = createRouter({
	history: createMemoryHistory(),
	routes: [
		{ path: '/', name: 'home' },
		{ path: '/about', name: 'about' },
	],
});

describe('SideNavPartial', () => {
	it('detects home route', async () => {
		router.push('/');
		await router.isReady();
		const wrapper = mount(SideNavPartial, { global: { plugins: [router] } });
		expect(wrapper.html()).toContain('Home');
	});
});
