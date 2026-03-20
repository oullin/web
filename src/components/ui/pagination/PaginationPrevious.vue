<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';
import PaginationLink from './PaginationLink.vue';
import { usePag } from './pagination';

interface Props {
	disabled?: boolean;
	class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<Props>(), {
	disabled: false,
});

const pager = usePag();
const isDisab = computed(() => props.disabled || pager.disabled.value || pager.page.value <= 1);

const onClick = () => {
	if (isDisab.value) {
		return;
	}

	pager.goToPreviousPage();
};
</script>

<template>
	<PaginationLink data-slot="pagination-previous" :disabled="isDisab" :class="props.class" @click="onClick">
		<slot>Prev</slot>
	</PaginationLink>
</template>
