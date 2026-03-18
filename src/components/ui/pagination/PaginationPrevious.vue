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
const isDisabled = computed(() => props.disabled || pagination.disabled.value || pagination.page.value <= 1);

const handleClick = () => {
	if (isDisabled.value) {
		return;
	}

	pagination.goToPreviousPage();
};
</script>

<template>
	<PaginationLink data-slot="pagination-previous" :disabled="isDisabled" :class="props.class" @click="handleClick">
		<slot>Prev</slot>
	</PaginationLink>
</template>
