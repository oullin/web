import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { image, date, getReadingTime, getRandomInt } from '@/public.ts';

describe('public utilities', () => {
	describe('image', () => {
		it('prefixes filenames with the images directory', () => {
			expect(image('hero.png')).toBe('/images/hero.png');
			expect(image('avatars/user.jpg')).toBe('/images/avatars/user.jpg');
		});
	});

	describe('date', () => {
		it('returns a formatter with default locale and options when omitted', () => {
			const formatter = date();
			const options = formatter.resolvedOptions();

			expect(options.locale.toLowerCase()).toContain('en');
			expect(options.year).toBe('numeric');
			expect(options.month).toBe('long');
			expect(options.day).toBe('numeric');
		});

		it('honours custom language and formatting options', () => {
			const formatter = date('es-ES', { month: '2-digit', day: '2-digit', year: '2-digit', timeZone: 'UTC' });
			const formatted = formatter.format(new Date('2024-03-05T12:34:56Z'));

			expect(formatter.resolvedOptions().locale.toLowerCase()).toContain('es');
			expect(formatted).toBe('05/03/24');
		});
	});

	describe('getReadingTime', () => {
		it('returns a default of 1 minute for empty or invalid input', () => {
			expect(getReadingTime('')).toBe('1 min read');
			expect(getReadingTime('   ')).toBe('1 min read');
			expect(getReadingTime('Example text', 0)).toBe('1 min read');
		});

		it('calculates minute intervals for typical articles', () => {
			const text = Array.from({ length: 450 }, (_, index) => `word${index}`).join(' ');
			expect(getReadingTime(text)).toBe('2 min read');
		});

		it('formats multi-hour durations with remaining minutes', () => {
			const text = Array.from({ length: 15000 }, () => 'word').join(' ');
			expect(getReadingTime(text, 200)).toBe('1 hour 15 min read');
		});

		it('formats exact hours without trailing minutes', () => {
			const text = Array.from({ length: 14400 }, () => 'word').join(' ');
			expect(getReadingTime(text, 120)).toBe('2 hours read');
		});
	});

	describe('getRandomInt', () => {
		const originalRandom = Math.random;

		beforeEach(() => {
			vi.restoreAllMocks();
			Math.random = originalRandom;
		});

		afterEach(() => {
			Math.random = originalRandom;
		});

		it('returns the lower bound when Math.random yields 0', () => {
			Math.random = vi.fn(() => 0);
			expect(getRandomInt(5, 10)).toBe(5);
		});

		it('returns the upper bound when Math.random yields nearly 1', () => {
			Math.random = vi.fn(() => 0.999999);
			expect(getRandomInt(5, 10)).toBe(10);
		});

		it('correctly handles negative ranges', () => {
			Math.random = vi.fn(() => 0.25);
			expect(getRandomInt(-5, -2)).toBe(-4);
		});

		it('throws when min is greater than max', () => {
			expect(() => getRandomInt(5, 4)).toThrowError('min must be less than or equal to max');
		});
	});
});
