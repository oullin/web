import type { RouteLocationRaw } from 'vue-router';

export type TagSummaryState = {
	isLoading: boolean;
	hasError: boolean;
	postCount: number;
};

export type TagSummaryDescription = {
	text: string;
	label?: string;
	suffix?: string;
	onLabelClick?: () => void;
};

const DEFAULT_LABEL = '#TAG';

export function normalizeParam(value: unknown): string {
	if (typeof value === 'string') {
		return value.trim().toLowerCase();
	}

	if (Array.isArray(value)) {
		const [first] = value;
		return typeof first === 'string' ? first.trim().toLowerCase() : '';
	}

	return '';
}

export function formatLabel(tag?: string | null): string {
	const normalized = (tag ?? '').trim();
	if (!normalized) {
		return DEFAULT_LABEL;
	}

	return `#${normalized.toUpperCase()}`;
}

function formatParam(tag: string): string {
	return tag.trim().toLowerCase();
}

export function routeFor(tag: string): RouteLocationRaw {
	const param = formatParam(tag);

	return {
		name: 'TagPosts',
		params: { tag: param },
	};
}

export function summaryFor(tag: string, state: TagSummaryState, onLabelClick?: (label: string) => void): TagSummaryDescription {
	if (!tag) {
		return { text: 'Select a tag to explore related posts.' };
	}

	const label = formatLabel(tag);
	const handleLabelClick = onLabelClick ? () => onLabelClick(label) : undefined;

	if (state.isLoading) {
		return { text: 'Loading posts for', label, suffix: '…', onLabelClick: handleLabelClick };
	}

	if (state.hasError) {
		return { text: "We couldn't load posts for", label, suffix: '.', onLabelClick: handleLabelClick };
	}

	if (state.postCount === 0) {
		return { text: 'No posts found for', label, suffix: '.', onLabelClick: handleLabelClick };
	}

	const noun = state.postCount === 1 ? 'post' : 'posts';
	return { text: `${state.postCount} ${noun} found for `, label, suffix: '', onLabelClick: handleLabelClick };
}
