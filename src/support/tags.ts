import type { RouteLocationRaw } from 'vue-router';

export type TagSummaryState = {
	isLoading: boolean;
	hasError: boolean;
	postCount: number;
};

export class Tags {
	private static readonly DEFAULT_LABEL = '#TAG';

	static normalizeParam(value: unknown): string {
		if (typeof value === 'string') {
			return value.trim();
		}

		if (Array.isArray(value)) {
			const [first] = value as Array<unknown>;
			return typeof first === 'string' ? first.trim() : '';
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

	static summaryFor(tag: string, state: TagSummaryState): string {
		if (!tag) {
			return 'Select a tag to explore related posts.';
		}

		const label = this.formatLabel(tag);

		if (state.isLoading) {
			return `Loading posts for ${label}…`;
		}

		if (state.hasError) {
			return `We couldn't load posts for ${label}.`;
		}

		if (state.postCount === 0) {
			return `No posts found for ${label}.`;
		}

		const noun = state.postCount === 1 ? 'post' : 'posts';
		return `${state.postCount} ${noun} found for ${label}.`;
	}
}
