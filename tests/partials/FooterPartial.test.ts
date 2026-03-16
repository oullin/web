import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import FooterPartial from '@partials/FooterPartial.vue';

vi.mock('@api/store.ts', () => ({
	useApiStore: () => ({
		getSocial: vi.fn().mockResolvedValue({ data: [] }),
	}),
}));

vi.mock('@api/http-error.ts', () => ({ debugError: vi.fn() }));

describe('FooterPartial', () => {
	it('renders copyright', () => {
		const wrapper = mount(FooterPartial, {
			global: { stubs: { RouterLink: { template: '<a :to="to"><slot /></a>', props: ['to'] } } },
		});
		expect(wrapper.text()).toContain('OULLIN // GUSTAVO OCANTO');
		expect(wrapper.text()).toContain('Terms');

		const termsLink = wrapper.findAll('a').find((a) => a.text() === 'Terms');
		expect(termsLink?.attributes('to')).toBe('/terms-and-conditions');
	});
});
