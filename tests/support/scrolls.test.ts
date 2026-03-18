import { describe, it, expect, vi, beforeEach } from 'vitest';
import { scrollBehavior } from '@/support/scrolls';
import type { RouteLocationNormalized } from 'vue-router';

describe('scrollBehavior', () => {
	beforeEach(() => {
		vi.stubGlobal('window', {
			scroll: vi.fn(),
		});
	});

	it('returns hash when to.hash is present', () => {
		const to = { hash: '#foo' } as RouteLocationNormalized;
		const result = scrollBehavior(to, {} as RouteLocationNormalized, null);
		expect(result).toEqual({ el: '#foo', behavior: 'smooth' });
	});

	it('scrolls to top when no hash is present', () => {
		const to = { hash: '' } as RouteLocationNormalized;
		const html = document.createElement('html');
		vi.spyOn(document, 'querySelector').mockReturnValue(html);

		scrollBehavior(to, {} as RouteLocationNormalized, null);

		expect(window.scroll).toHaveBeenCalledWith({ top: 0 });
		expect(html.style.scrollBehavior).toBe('');
	});

	it('does nothing if html element is not found', () => {
		const to = { hash: '' } as RouteLocationNormalized;
		vi.spyOn(document, 'querySelector').mockReturnValue(null);

		scrollBehavior(to, {} as RouteLocationNormalized, null);

		expect(window.scroll).not.toHaveBeenCalled();
	});
});
