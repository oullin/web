import { describe, it, expect } from 'vitest';
import { nextTick, ref } from 'vue';
import { usePagination } from '@/support/pagination.ts';

describe('usePagination', () => {
	it('calculates pages and slices items', () => {
		const items = ref([1, 2, 3, 4]);
		const pagination = usePagination(items, { itemsPerPage: 2 });

		expect(pagination.totalPages.value).toBe(2);
		expect(pagination.paginatedItems.value).toEqual([1, 2]);

		pagination.goToNextPage();

		expect(pagination.currentPage.value).toBe(2);
		expect(pagination.paginatedItems.value).toEqual([3, 4]);

		pagination.goToNextPage();

		expect(pagination.currentPage.value).toBe(2);
	});

	it('resets to first page when items shrink below current page', async () => {
		const items = ref([1, 2, 3, 4, 5, 6]);
		const pagination = usePagination(items, { itemsPerPage: 2 });

		pagination.goToNextPage();
		pagination.goToNextPage();

		expect(pagination.currentPage.value).toBe(3);

		items.value = [1];
		await nextTick();

		expect(pagination.currentPage.value).toBe(1);
		expect(pagination.totalPages.value).toBe(1);
	});

	it('responds to in-place mutations of the collection', async () => {
		const items = ref([1, 2, 3, 4]);
		const pagination = usePagination(items, { itemsPerPage: 2 });

		pagination.goToNextPage();

		expect(pagination.currentPage.value).toBe(2);
		expect(pagination.totalPages.value).toBe(2);

		items.value.splice(2);
		await nextTick();

		expect(pagination.currentPage.value).toBe(1);
		expect(pagination.totalPages.value).toBe(1);
	});

	it('handles empty collections by returning a single page', async () => {
		const items = ref<number[]>([]);
		const pagination = usePagination(items, { itemsPerPage: 5 });

		expect(pagination.totalPages.value).toBe(1);
		expect(pagination.paginatedItems.value).toEqual([]);

		items.value = [1, 2, 3];
		await nextTick();

		expect(pagination.totalPages.value).toBe(1);
	});

	it('normalises invalid initial pages to the first page', () => {
		const items = ref([1, 2, 3]);
		const pagination = usePagination(items, { itemsPerPage: 1, initialPage: 0 });

		expect(pagination.currentPage.value).toBe(1);
	});
});
