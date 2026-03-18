<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';
import PaginationLink from './PaginationLink.vue';
import { usePaginationContext } from './pagination';

interface Props {
	value: number;
	isActive?: boolean;
	disabled?: boolean;
	class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<Props>(), {
	isActive: false,
	disabled: false,
});

const pagination = usePaginationContext();
const isDisabled = computed(() => props.disabled || pagination.disabled.value);

const handleClick = () => {
	if (isDisabled.value) {
		return;
	}

	pagination.setPage(props.value);
};
</script>

<template>
	<PaginationLink data-slot="pagination-item" :is-active="props.isActive" :disabled="isDisabled" :class="props.class" @click="handleClick">
		<slot>{{ props.value }}</slot>
	</PaginationLink>
</template>
