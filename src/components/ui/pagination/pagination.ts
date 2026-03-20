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

export const PAG_CTX = Symbol('PaginationContext') as InjectionKey<PaginationContextValue>;

export const pagBase = 'page-panel-copy cursor-pointer border px-3 py-2 text-xs uppercase tracking-[0.14em] transition-colors disabled:cursor-not-allowed disabled:opacity-40';

export const pagBtn = `${pagBase} border-(--border) hover:border-(--primary) hover:text-(--text)`;
export const pagAct = `${pagBase} border-(--primary) text-(--primary)`;

export const pagItems = (page: number, pageCount: number, siblingCount: number, showEdges: boolean): PaginationRenderItem[] => {
	if (pageCount <= 0) {
		return [];
	}

	const pageNum = clampPg(page, pageCount);
	const pages = new Set<number>();
	const start = Math.max(showEdges ? 2 : 1, pageNum - siblingCount);
	const end = Math.min(showEdges ? pageCount - 1 : pageCount, pageNum + siblingCount);

	if (showEdges) {
		pages.add(1);
		pages.add(pageCount);
	}

	for (let value = start; value <= end; value += 1) {
		pages.add(value);
	}

	if (!showEdges && pages.size === 0) {
		pages.add(pageNum);
	}

	const pageList = [...pages].toSorted((left, right) => left - right);
	const items: PaginationRenderItem[] = [];

	for (const value of pageList) {
		const prevItem = items[items.length - 1];

		if (prevItem?.type === 'page' && value - prevItem.value > 1) {
			items.push({ type: 'ellipsis', key: `${prevItem.value}-${value}` });
		}

		items.push({ type: 'page', value });
	}

	return items;
};

export const clampPg = (page: number, pageCount: number) => {
	if (pageCount <= 0) {
		return 1;
	}

	return Math.min(Math.max(1, Math.trunc(page)), pageCount);
};

export const usePag = () => {
	const context = inject(PAG_CTX);

	if (!context) {
		throw new Error('Pagination components must be used within a Pagination root.');
	}

	return context;
};
