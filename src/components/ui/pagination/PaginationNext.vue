<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';
import PaginationLink from './PaginationLink.vue';
import { usePaginationContext } from './pagination';

interface Props {
	disabled?: boolean;
	class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<Props>(), {
	disabled: false,
});

const pagination = usePaginationContext();
const isDisabled = computed(() => props.disabled || pagination.disabled.value || pagination.page.value >= pagination.pageCount.value);

const handleClick = () => {
	if (isDisabled.value) {
		return;
	}

	pagination.goToNextPage();
};
</script>

<template>
	<PaginationLink data-slot="pagination-next" :disabled="isDisabled" :class="props.class" @click="handleClick">
		<slot>Next</slot>
	</PaginationLink>
</template>
