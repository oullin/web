<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';
import PaginationLink from './PaginationLink.vue';
import { usePag } from './pagination';

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

const pager = usePag();
const isDisab = computed(() => props.disabled || pager.disabled.value);

const onClick = () => {
	if (isDisab.value) {
		return;
	}

	pager.setPage(props.value);
};
</script>

<template>
	<PaginationLink data-slot="pagination-item" :is-active="props.isActive" :disabled="isDisab" :class="props.class" @click="onClick">
		<slot>{{ props.value }}</slot>
	</PaginationLink>
</template>
