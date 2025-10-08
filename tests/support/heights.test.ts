import { describe, expect, it } from 'vitest';

import { Heights } from '@/support/heights';

describe('Heights', () => {
	it('provides immutable resume section min heights', () => {
		const min = Heights.resumeSectionMinHeights();

		expect(min).toEqual({
			education: { base: 26, lg: 28 },
			experience: { base: 34, lg: 36 },
			recommendations: { base: 30, lg: 32 },
		});
		expect(Object.isFrozen(min)).toBe(true);
		expect(Object.isFrozen(min.education)).toBe(true);
		expect(Object.isFrozen(min.experience)).toBe(true);
		expect(Object.isFrozen(min.recommendations)).toBe(true);
	});

	it('builds resume section min-height classes', () => {
		expect(Heights.resumeSectionHeights()).toEqual({
			education: 'min-h-[26rem] lg:min-h-[28rem]',
			experience: 'min-h-[34rem] lg:min-h-[36rem]',
			recommendations: 'min-h-[30rem] lg:min-h-[32rem]',
		});
	});

	it('calculates the total resume sections min-height', () => {
		expect(Heights.resumeSectionsTotalHeight()).toBe('min-h-[96rem] lg:min-h-[102rem]');
	});

	it('exposes safelisted resume section classes for tailwind', () => {
		expect(Heights.resumeSectionHeightSafelist()).toEqual([
			'min-h-[26rem]',
			'lg:min-h-[28rem]',
			'min-h-[34rem]',
			'lg:min-h-[36rem]',
			'min-h-[30rem]',
			'lg:min-h-[32rem]',
			'min-h-[96rem]',
			'lg:min-h-[102rem]',
		]);
	});
});
