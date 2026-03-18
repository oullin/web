<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed, provide, ref, watch } from 'vue';
import { cn } from '@components/lib/utils';
import { buildPaginationItems, clampPage, PAGINATION_CONTEXT } from './pagination';

interface Props {
	total: number;
	itemsPerPage?: number;
	siblingCount?: number;
	showEdges?: boolean;
	page?: number;
	defaultPage?: number;
	disabled?: boolean;
	class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<Props>(), {
	itemsPerPage: 10,
	siblingCount: 1,
	showEdges: true,
	defaultPage: 1,
	disabled: false,
});

const emit = defineEmits<{
	'update:page': [page: number];
}>();

const uncontrolledPage = ref(props.defaultPage);

const pageCount = computed(() => {
	const total = Number.isFinite(props.total) ? Math.max(0, props.total) : 0;
	const itemsPerPage = Number.isFinite(props.itemsPerPage) ? Math.max(1, props.itemsPerPage) : 1;

	return Math.max(1, Math.ceil(total / itemsPerPage));
});

const currentPage = computed({
	get: () => clampPage(props.page ?? uncontrolledPage.value, pageCount.value),
	set: (page: number) => {
		const nextPage = clampPage(page, pageCount.value);

		if (props.page === undefined) {
			uncontrolledPage.value = nextPage;
		}

		emit('update:page', nextPage);
	},
});

const isDisabled = computed(() => props.disabled);
const items = computed(() => buildPaginationItems(currentPage.value, pageCount.value, props.siblingCount, props.showEdges));

watch(pageCount, (nextPageCount) => {
	if (currentPage.value > nextPageCount) {
		currentPage.value = nextPageCount;
	}
});

provide(PAGINATION_CONTEXT, {
	page: currentPage,
	pageCount,
	items,
	disabled: isDisabled,
	setPage: (page) => {
		currentPage.value = page;
	},
	goToPreviousPage: () => {
		currentPage.value = currentPage.value - 1;
	},
	goToNextPage: () => {
		currentPage.value = currentPage.value + 1;
	},
});
</script>

<template>
	<nav role="navigation" aria-label="Pagination" data-slot="pagination" :class="cn('flex w-full', props.class)">
		<slot :page="currentPage" :page-count="pageCount.value" :pageCount="pageCount.value" />
	</nav>
</template>
