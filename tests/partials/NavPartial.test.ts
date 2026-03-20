import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import NavPartial from '@partials/NavPartial.vue';
import { siteContent } from '@support/content.ts';

const toggleDarkMode = vi.fn();
const getLinks = vi.fn().mockResolvedValue({ data: [] });

vi.mock('@/dark-mode.ts', () => ({
	useDarkMode: () => ({
		isDark: false,
		toggleDarkMode,
	}),
}));

vi.mock('@api/store.ts', () => ({
	useApiStore: () => ({
		getLinks,
	}),
}));

vi.mock('@api/http-error.ts', () => ({ debugError: vi.fn() }));

describe('NavPartial', () => {
	it('renders the primary site links including contact', () => {
		const wrapper = mount(NavPartial, {
			global: {
				stubs: {
					RouterLink: { template: '<a :to="to"><slot /></a>', props: ['to'] },
				},
			},
		});

		siteContent.nav.links.forEach((link) => {
			expect(wrapper.text()).toContain(link.label);
		});
		expect(wrapper.text()).toContain('oullin');

		const homeLink = wrapper.findAll('a').find((link) => link.text().includes('oullin'));
		expect(homeLink?.attributes('to')).toBe('/');
		expect(homeLink?.findAll('img')).toHaveLength(1);

		const contactNavLink = siteContent.nav.links.find((link) => link.to === '/contact');
		expect(contactNavLink).toBeDefined();
		const contactLink = wrapper.findAll('a').find((link) => link.attributes('to') === contactNavLink?.to);
		expect(contactLink?.text()).toContain(contactNavLink!.label);
	});
});
