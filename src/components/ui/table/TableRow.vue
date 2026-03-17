<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@components/lib/utils';

const props = defineProps<{
	class?: HTMLAttributes['class'];
}>();
</script>

<template>
	<tr data-slot="table-row" :class="cn('border-b border-[var(--border)] transition-colors', props.class)">
		<slot />
	</tr>
</template>
