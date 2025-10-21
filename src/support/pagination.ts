import { computed, ref, watch, type ComputedRef, type Ref } from 'vue';

export interface UsePaginationOptions {
	itemsPerPage: number;
	initialPage?: number;
}

export interface PaginationResponse<T> {
	currentPage: Ref<number>;
	totalPages: ComputedRef<number>;
	paginatedItems: ComputedRef<readonly T[]>;
	goToPreviousPage: () => void;
	goToNextPage: () => void;
}

export function usePagination<T>(items: ComputedRef<readonly T[]> | Ref<readonly T[]>, { itemsPerPage, initialPage = 1 }: UsePaginationOptions): PaginationResponse<T> {
	const currentPage = ref(initialPage);

	const totalPages = computed(() => Math.max(1, Math.ceil(items.value.length / Math.max(1, itemsPerPage))));

	const paginatedItems = computed(() => {
		const start = (currentPage.value - 1) * itemsPerPage;

		return items.value.slice(start, start + itemsPerPage);
	});

	const isFirstPage = computed(() => currentPage.value === 1);
	const isLastPage = computed(() => currentPage.value === totalPages.value);

	watch(
		[items, () => items.value.length],
		() => {
			const collection = items.value;

			if (!collection.length) {
				currentPage.value = 1;

				return;
			}

			if (currentPage.value > totalPages.value) {
				currentPage.value = totalPages.value;
			}
		},
		{ immediate: true },
	);

	const goToPreviousPage = () => {
		if (!isFirstPage.value) {
			currentPage.value -= 1;
		}
	};

	const goToNextPage = () => {
		if (!isLastPage.value) {
			currentPage.value += 1;
		}
	};

	return {
		currentPage,
		totalPages,
		paginatedItems,
		goToPreviousPage,
		goToNextPage,
	};
}
