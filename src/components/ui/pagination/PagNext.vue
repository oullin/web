<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';
import PaginationLink from './PagLink.vue';
import { usePag } from './pagination';

interface Props {
	disabled?: boolean;
	class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<Props>(), {
	disabled: false,
});

const pager = usePag();
const isDisab = computed(() => props.disabled || pager.disabled.value || pager.page.value >= pager.pageCount.value);

const onClick = () => {
	if (isDisab.value) {
		return;
	}

	pager.goToNextPage();
};
</script>

<template>
	<PaginationLink data-slot="pagination-next" :disabled="isDisab" :class="props.class" @click="onClick">
		<slot>Next</slot>
	</PaginationLink>
</template>
