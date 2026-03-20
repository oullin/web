<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed, provide, ref, watch } from 'vue';
import { cn } from '@components/lib/utils';
import { pagItems, clampPg, PAG_CTX } from './pagination';

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

const localPg = ref(props.defaultPage);

const pageCnt = computed(() => {
	const total = Number.isFinite(props.total) ? Math.max(0, props.total) : 0;
	const perPage = Number.isFinite(props.itemsPerPage) ? Math.max(1, props.itemsPerPage) : 1;

	return Math.max(1, Math.ceil(total / perPage));
});

const curPage = computed({
	get: () => clampPg(props.page ?? localPg.value, pageCnt.value),
	set: (page: number) => {
		const nextPg = clampPg(page, pageCnt.value);

		if (props.page === undefined) {
			localPg.value = nextPg;
		}

		emit('update:page', nextPg);
	},
});

const isDisab = computed(() => props.disabled);
const items = computed(() => pagItems(curPage.value, pageCnt.value, props.siblingCount, props.showEdges));

watch(pageCnt, (nextCnt) => {
	if (curPage.value > nextCnt) {
		curPage.value = nextCnt;
	}
});

provide(PAG_CTX, {
	page: curPage,
	pageCount: pageCnt,
	items,
	disabled: isDisab,
	setPage: (page) => {
		curPage.value = page;
	},
	goToPreviousPage: () => {
		curPage.value = curPage.value - 1;
	},
	goToNextPage: () => {
		curPage.value = curPage.value + 1;
	},
});
</script>

<template>
	<nav role="navigation" aria-label="Pagination" data-slot="pagination" :class="cn('flex w-full', props.class)">
		<slot :page="curPage" :page-count="pageCnt.value" :pageCount="pageCnt.value" />
	</nav>
</template>
