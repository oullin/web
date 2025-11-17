import { describe, expect, it, vi } from 'vitest';
import { Tags, type TagSummaryState } from '@/support/tags.ts';

const baseSummaryState: TagSummaryState = {
	isLoading: false,
	hasError: false,
	postCount: 0,
};

describe('Tags.normalizeParam', () => {
	it('returns trimmed strings as-is', () => {
		expect(Tags.normalizeParam('  vue ')).toBe('vue');
	});

	it('normalizes tag casing to lowercase', () => {
		expect(Tags.normalizeParam('  ReAcT  ')).toBe('react');
	});

	it('returns the first trimmed string when provided an array parameter', () => {
		expect(Tags.normalizeParam(['  php  ', 'extra'])).toBe('php');
	});

	it('returns an empty string for arrays without string values', () => {
		expect(Tags.normalizeParam([123])).toBe('');
	});

	it('returns an empty string for unsupported types', () => {
		expect(Tags.normalizeParam(undefined)).toBe('');
		expect(Tags.normalizeParam({})).toBe('');
	});
});

describe('Tags.formatLabel', () => {
	it('returns the default label when the tag is empty', () => {
		expect(Tags.formatLabel('')).toBe('#TAG');
		expect(Tags.formatLabel(null)).toBe('#TAG');
	});

	it('formats the tag as uppercase with a leading #', () => {
		expect(Tags.formatLabel('  vue ')).toBe('#VUE');
	});
});

describe('Tags.routeFor', () => {
	it('creates a router location pointing to TagPosts', () => {
		expect(Tags.routeFor('vue')).toEqual({
			name: 'TagPosts',
			params: { tag: 'vue' },
		});
	});
});

describe('Tags.summaryFor', () => {
	it('prompts the user to select a tag when one is missing', () => {
		expect(Tags.summaryFor('', baseSummaryState)).toEqual({ text: 'Select a tag to explore related posts.' });
	});

	it('describes loading state when awaiting posts', () => {
		expect(
			Tags.summaryFor('vue', {
				...baseSummaryState,
				isLoading: true,
			}),
		).toEqual({ text: 'Loading posts for ', label: '#VUE', suffix: '…', onLabelClick: undefined });
	});

	it('reports failures when the API request fails', () => {
		expect(
			Tags.summaryFor('vue', {
				...baseSummaryState,
				hasError: true,
			}),
		).toEqual({ text: "We couldn't load posts for ", label: '#VUE', suffix: '.', onLabelClick: undefined });
	});

	it('mentions when no posts were found', () => {
		expect(
			Tags.summaryFor('vue', {
				...baseSummaryState,
			}),
		).toEqual({ text: 'No posts found for ', label: '#VUE', suffix: '.', onLabelClick: undefined });
	});

	it('handles singular and plural post counts', () => {
		expect(
			Tags.summaryFor('vue', {
				...baseSummaryState,
				postCount: 1,
			}),
		).toEqual({ text: '1 post found for ', label: '#VUE', suffix: '.', onLabelClick: undefined });

		expect(
			Tags.summaryFor('vue', {
				...baseSummaryState,
				postCount: 3,
			}),
		).toEqual({ text: '3 posts found for ', label: '#VUE', suffix: '.', onLabelClick: undefined });
	});

	it('uses the callback for label clicks', () => {
		const handler = vi.fn();
		const summary = Tags.summaryFor(
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
