import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import NavPartial from '@partials/NavPartial.vue';

const toggleDarkMode = vi.fn();

vi.mock('@/dark-mode.ts', () => ({
	useDarkMode: () => ({
		isDark: false,
		toggleDarkMode,
	}),
}));

describe('NavPartial', () => {
	it('renders the primary site links including contact', () => {
		const wrapper = mount(NavPartial, {
			global: {
				stubs: {
					RouterLink: { template: '<a :to="to"><slot /></a>', props: ['to'] },
				},
			},
		});

		expect(wrapper.text()).toContain('writing');
		expect(wrapper.text()).toContain('projects');
		expect(wrapper.text()).toContain('about');
		expect(wrapper.text()).toContain('contact');
		expect(wrapper.text()).toContain('oullin');

		const homeLink = wrapper.findAll('a').find((link) => link.text().includes('oullin'));
		expect(homeLink?.attributes('to')).toBe('/');
		expect(homeLink?.findAll('img')).toHaveLength(1);

		const contactLink = wrapper.findAll('a').find((link) => link.text().includes('contact'));
		expect(contactLink?.attributes('to')).toBe('/contact');
		expect(wrapper.text()).toContain('BUILT: 2026.03');
		expect(wrapper.text()).toContain('NODE: OULLIN_PRIME');
		expect(wrapper.text()).not.toContain('SIGNAL: ACTIVE');
	});
});
