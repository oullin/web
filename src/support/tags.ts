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

export class Tags {
	private static readonly DEFAULT_LABEL = '#TAG';

	static normalizeParam(value: unknown): string {
		if (typeof value === 'string') {
			return value.trim().toLowerCase();
		}

		if (Array.isArray(value)) {
			const [first] = value;
			return typeof first === 'string' ? first.trim().toLowerCase() : '';
		}

		return '';
	}

	static formatLabel(tag?: string | null): string {
		const normalized = (tag ?? '').trim();
		if (!normalized) {
			return this.DEFAULT_LABEL;
		}

		return `#${normalized.toUpperCase()}`;
	}

	private static formatParam(tag: string): string {
		return tag.trim().toLowerCase();
	}

	static routeFor(tag: string): RouteLocationRaw {
		const param = this.formatParam(tag);

		return {
			name: 'TagPosts',
			params: { tag: param },
		};
	}

	static summaryFor(tag: string, state: TagSummaryState, onLabelClick?: (label: string) => void): TagSummaryDescription {
		if (!tag) {
			return { text: 'Select a tag to explore related posts.' };
		}

		const label = this.formatLabel(tag);
		const handleLabelClick = onLabelClick ? () => onLabelClick(label) : undefined;

		if (state.isLoading) {
			return { text: 'Loading posts for ', label, suffix: '…', onLabelClick: handleLabelClick };
		}

		if (state.hasError) {
			return { text: "We couldn't load posts for ", label, suffix: '.', onLabelClick: handleLabelClick };
		}

		if (state.postCount === 0) {
			return { text: 'No posts found for ', label, suffix: '.', onLabelClick: handleLabelClick };
		}

		const noun = state.postCount === 1 ? 'post' : 'posts';
		return { text: `${state.postCount} ${noun} found for `, label, suffix: '.', onLabelClick: handleLabelClick };
	}
}
