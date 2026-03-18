import type { ComputedRef, InjectionKey } from 'vue';
import { inject } from 'vue';

export type PaginationRenderItem =
	| {
			type: 'page';
			value: number;
	  }
	| {
			type: 'ellipsis';
			key: string;
	  };

export interface PaginationContextValue {
	page: ComputedRef<number>;
	pageCount: ComputedRef<number>;
	items: ComputedRef<PaginationRenderItem[]>;
	disabled: ComputedRef<boolean>;
	setPage: (page: number) => void;
	goToPreviousPage: () => void;
	goToNextPage: () => void;
}

export const PAGINATION_CONTEXT = Symbol('PaginationContext') as InjectionKey<PaginationContextValue>;

export const paginationBaseClasses = 'page-panel-copy cursor-pointer border px-3 py-2 text-xs uppercase tracking-[0.14em] transition-colors disabled:cursor-not-allowed disabled:opacity-40';

export const paginationButtonClasses = `${paginationBaseClasses} border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--text)]`;
export const paginationActiveButtonClasses = `${paginationBaseClasses} border-[var(--primary)] text-[var(--primary)]`;

export const buildPaginationItems = (page: number, pageCount: number, siblingCount: number, showEdges: boolean): PaginationRenderItem[] => {
	if (pageCount <= 0) {
		return [];
	}

	const normalizedPage = clampPage(page, pageCount);
	const pages = new Set<number>();
	const start = Math.max(showEdges ? 2 : 1, normalizedPage - siblingCount);
	const end = Math.min(showEdges ? pageCount - 1 : pageCount, normalizedPage + siblingCount);

	if (showEdges) {
		pages.add(1);
		pages.add(pageCount);
	}

	for (let value = start; value <= end; value += 1) {
		pages.add(value);
	}

	if (!showEdges && pages.size === 0) {
		pages.add(normalizedPage);
	}

	const orderedPages = [...pages].toSorted((left, right) => left - right);
	const items: PaginationRenderItem[] = [];

	for (const value of orderedPages) {
		const previousValue = items[items.length - 1];

		if (previousValue?.type === 'page' && value - previousValue.value > 1) {
			items.push({ type: 'ellipsis', key: `${previousValue.value}-${value}` });
		}

		items.push({ type: 'page', value });
	}

	return items;
};

export const clampPage = (page: number, pageCount: number) => {
	if (pageCount <= 0) {
		return 1;
	}

	return Math.min(Math.max(1, Math.trunc(page)), pageCount);
};

export const usePaginationContext = () => {
	const context = inject(PAGINATION_CONTEXT);

	if (!context) {
		throw new Error('Pagination components must be used within a Pagination root.');
	}

	return context;
};
