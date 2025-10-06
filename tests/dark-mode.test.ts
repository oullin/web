import { describe, it, expect, beforeEach, vi } from 'vitest';
import { nextTick } from 'vue';

describe('useDarkMode', () => {
	beforeEach(() => {
		vi.resetModules();
		localStorage.clear();
		document.documentElement.className = '';
	});

	it('initialises from stored preference and toggles back to light mode', async () => {
		localStorage.setItem('dark-mode', 'true');
		const { useDarkMode } = await import('@/dark-mode.ts');

		const { isDark, toggleDarkMode } = useDarkMode();

		await nextTick();

		expect(isDark.value).toBe(true);
		expect(localStorage.getItem('dark-mode')).toBe('true');
		expect(document.documentElement.classList.contains('dark')).toBe(true);

		toggleDarkMode();
		await nextTick();

		expect(isDark.value).toBe(false);
		expect(localStorage.getItem('dark-mode')).toBe('false');
		expect(document.documentElement.classList.contains('dark')).toBe(false);
	});

	it('defaults to light mode and persists toggles to storage', async () => {
		const { useDarkMode } = await import('@/dark-mode.ts');

		const { isDark, toggleDarkMode } = useDarkMode();

		await nextTick();

		expect(isDark.value).toBe(false);
		expect(localStorage.getItem('dark-mode')).toBe('false');
		expect(document.documentElement.classList.contains('dark')).toBe(false);

		toggleDarkMode();
		await nextTick();

		expect(isDark.value).toBe(true);
		expect(localStorage.getItem('dark-mode')).toBe('true');
		expect(document.documentElement.classList.contains('dark')).toBe(true);
	});
});
