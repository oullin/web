<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';
import { cn } from '@components/lib/utils';
import { pagAct, pagBtn } from './pagination';

interface Props {
	isActive?: boolean;
	disabled?: boolean;
	class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<Props>(), {
	isActive: false,
	disabled: false,
});

const classes = computed(() => cn(props.isActive ? pagAct : pagBtn, props.class));
</script>

<template>
	<button type="button" data-slot="pagination-link" :class="classes" :aria-current="props.isActive ? 'page' : undefined" :disabled="props.disabled">
		<slot />
	</button>
</template>
