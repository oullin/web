import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ref } from 'vue';
import { observeSections, disconnectSectionsObserver, setManuallySelectedSectionId } from '@/support/observer';

declare global {
	interface Window {
		IntersectionObserver: typeof IntersectionObserver;
	}
}

describe('observer support utilities', () => {
	let intersectionCallback: IntersectionObserverCallback | null = null;

	beforeEach(() => {
		class MockIntersectionObserver {
			constructor(callback: IntersectionObserverCallback) {
				intersectionCallback = callback;
			}

			observe() {}
			unobserve() {}
			disconnect() {}
		}

		Object.defineProperty(window, 'IntersectionObserver', {
			writable: true,
			configurable: true,
			value: MockIntersectionObserver,
		});

		document.body.innerHTML = ["<section data-section-id='education'></section>", "<section data-section-id='experience'></section>"].join('');
	});

	afterEach(() => {
		disconnectSectionsObserver();
		document.body.innerHTML = '';
		intersectionCallback = null;
	});

	const getSection = (id: string) => {
		const section = document.querySelector<HTMLElement>(`[data-section-id='${id}']`);

		if (!section) {
			throw new Error(`Expected section '${id}' to exist`);
		}

		return section;
	};

	it('ignores observer updates for other sections when a manual selection is active', () => {
		const navigationItems = [{ href: '#education' }, { href: '#experience' }] as const;
		const activeSectionId = ref('education');

		activeSectionId.value = 'experience';
		setManuallySelectedSectionId('experience');
		observeSections(navigationItems, activeSectionId);

		if (!intersectionCallback) {
			throw new Error('IntersectionObserver callback not captured');
		}

		intersectionCallback([
			{
				isIntersecting: true,
				target: getSection('education'),
				intersectionRatio: 1,
			} as IntersectionObserverEntry,
		]);

		expect(activeSectionId.value).toBe('experience');

		intersectionCallback([
			{
				isIntersecting: true,
				target: getSection('experience'),
				intersectionRatio: 1,
			} as IntersectionObserverEntry,
		]);

		expect(activeSectionId.value).toBe('experience');

		intersectionCallback([
			{
				isIntersecting: true,
				target: getSection('education'),
				intersectionRatio: 1,
			} as IntersectionObserverEntry,
		]);

		expect(activeSectionId.value).toBe('education');
	});
});
