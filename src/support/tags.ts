import type { RouteLocationRaw } from 'vue-router';

export type TagSummaryState = {
	isLoading: boolean;
	hasError: boolean;
	postCount: number;
};

type TagSummaryDescription = {
	text: string;
	label?: string;
	suffix?: string;
	onLabelClick?: () => void;
};

const DEF_LBL = '#TAG';
const badTagRx = /[<>"'&]/g;

export function cleanTag(tag: string): string {
	return tag.replace(badTagRx, '');
}

export function normTag(value: unknown): string {
	if (typeof value === 'string') {
		return value.trim().toLowerCase();
	}

	if (Array.isArray(value)) {
		const [first] = value;
		return typeof first === 'string' ? first.trim().toLowerCase() : '';
	}

	return '';
}

function fmtTag(tag: string): string {
	if (!tag) {
		return DEF_LBL;
	}

	return `#${tag.toUpperCase()}`;
}

export function fmtLabel(tag?: string | null): string {
	return fmtTag(cleanTag((tag ?? '').trim()));
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

export function tagSum(tag: string, state: TagSummaryState, onLabelClick?: (label: string) => void): TagSummaryDescription {
	const clean = cleanTag(tag.trim());
	if (!clean) {
		return { text: 'Select a tag to explore related posts.' };
	}

	const label = fmtTag(clean);
	const clickFn = onLabelClick ? () => onLabelClick(label) : undefined;

	if (state.isLoading) {
		return { text: 'Loading posts for', label, suffix: '…', onLabelClick: clickFn };
	}

	if (state.hasError) {
		return { text: "We couldn't load posts for", label, suffix: '.', onLabelClick: clickFn };
	}

	if (state.postCount === 0) {
		return { text: 'No posts found for', label, suffix: '.', onLabelClick: clickFn };
	}

	const noun = state.postCount === 1 ? 'post' : 'posts';
	return { text: `${state.postCount} ${noun} found for`, label, suffix: '', onLabelClick: clickFn };
}
