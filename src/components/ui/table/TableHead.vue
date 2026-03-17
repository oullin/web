<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@components/lib/utils';

const props = defineProps<{
	class?: HTMLAttributes['class'];
}>();
</script>

<template>
	<th data-slot="table-head" :class="cn('h-10 px-4 text-left align-middle font-medium text-[var(--muted)]', props.class)">
		<slot />
	</th>
</template>
