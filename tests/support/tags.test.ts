import { describe, expect, it } from 'vitest';
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
		expect(Tags.summaryFor('', baseSummaryState)).toBe('Select a tag to explore related posts.');
	});

	it('describes loading state when awaiting posts', () => {
		expect(
			Tags.summaryFor('vue', {
				...baseSummaryState,
				isLoading: true,
			}),
		).toBe('Loading posts for #VUE…');
	});

	it('reports failures when the API request fails', () => {
		expect(
			Tags.summaryFor('vue', {
				...baseSummaryState,
				hasError: true,
			}),
		).toBe("We couldn't load posts for #VUE.");
	});

	it('mentions when no posts were found', () => {
		expect(
			Tags.summaryFor('vue', {
				...baseSummaryState,
			}),
		).toBe('No posts found for #VUE.');
	});

	it('handles singular and plural post counts', () => {
		expect(
			Tags.summaryFor('vue', {
				...baseSummaryState,
				postCount: 1,
			}),
		).toBe('1 post found for #VUE.');

		expect(
			Tags.summaryFor('vue', {
				...baseSummaryState,
				postCount: 3,
			}),
		).toBe('3 posts found for #VUE.');
	});
});
