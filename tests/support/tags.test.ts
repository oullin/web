import { describe, expect, it, vi } from 'vitest';
import { formatLabel, normalizeParam, routeFor, sanitizeTag, summaryFor, type TagSummaryState } from '@/support/tags.ts';

const baseSummaryState: TagSummaryState = {
	isLoading: false,
	hasError: false,
	postCount: 0,
};

describe('Tags.normalizeParam', () => {
	it('returns trimmed strings as-is', () => {
		expect(normalizeParam('  vue ')).toBe('vue');
	});

	it('normalizes tag casing to lowercase', () => {
		expect(normalizeParam('  ReAcT  ')).toBe('react');
	});

	it('returns the first trimmed string when provided an array parameter', () => {
		expect(normalizeParam(['  php  ', 'extra'])).toBe('php');
	});

	it('returns an empty string for arrays without string values', () => {
		expect(normalizeParam([123])).toBe('');
	});

	it('returns an empty string for unsupported types', () => {
		expect(normalizeParam(undefined)).toBe('');
		expect(normalizeParam({})).toBe('');
	});
});

describe('Tags.formatLabel', () => {
	it('returns the default label when the tag is empty', () => {
		expect(formatLabel('')).toBe('#TAG');
		expect(formatLabel(null)).toBe('#TAG');
	});

	it('formats the tag as uppercase with a leading #', () => {
		expect(formatLabel('  vue ')).toBe('#VUE');
	});

	it('strips unsafe characters before formatting', () => {
		expect(formatLabel('<script>alert(1)</script>')).toBe('#SCRIPTALERT(1)/SCRIPT');
	});
});

describe('Tags.routeFor', () => {
	it('creates a router location pointing to TagPosts', () => {
		expect(routeFor('vue')).toEqual({
			name: 'TagPosts',
			params: { tag: 'vue' },
		});
	});
});

describe('Tags.sanitizeTag', () => {
	it('removes HTML-significant characters', () => {
		expect(sanitizeTag('<script>alert("x")</script>')).toBe('scriptalert(x)/script');
		expect(sanitizeTag('vue & react')).toBe('vue  react');
	});
});

describe('Tags.summaryFor', () => {
	it('prompts the user to select a tag when one is missing', () => {
		expect(summaryFor('', baseSummaryState)).toEqual({ text: 'Select a tag to explore related posts.' });
	});

	it('describes loading state when awaiting posts', () => {
		expect(
			summaryFor('vue', {
				...baseSummaryState,
				isLoading: true,
			}),
		).toEqual({ text: 'Loading posts for', label: '#VUE', suffix: '…', onLabelClick: undefined });
	});

	it('reports failures when the API request fails', () => {
		expect(
			summaryFor('vue', {
				...baseSummaryState,
				hasError: true,
			}),
		).toEqual({ text: "We couldn't load posts for", label: '#VUE', suffix: '.', onLabelClick: undefined });
	});

	it('mentions when no posts were found', () => {
		expect(
			summaryFor('vue', {
				...baseSummaryState,
			}),
		).toEqual({ text: 'No posts found for', label: '#VUE', suffix: '.', onLabelClick: undefined });
	});

	it('handles singular and plural post counts', () => {
		expect(
			summaryFor('vue', {
				...baseSummaryState,
				postCount: 1,
			}),
		).toEqual({ text: '1 post found for ', label: '#VUE', suffix: '', onLabelClick: undefined });

		expect(
			summaryFor('vue', {
				...baseSummaryState,
				postCount: 3,
			}),
		).toEqual({ text: '3 posts found for ', label: '#VUE', suffix: '', onLabelClick: undefined });
	});

	it('uses the callback for label clicks', () => {
		const handler = vi.fn();
		const summary = summaryFor(
			'vue',
			{
				...baseSummaryState,
				postCount: 2,
			},
			handler,
		);

		expect(summary.label).toBe('#VUE');
		summary.onLabelClick?.();
		expect(handler).toHaveBeenCalledWith('#VUE');
	});
});
