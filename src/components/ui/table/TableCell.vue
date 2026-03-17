<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@components/lib/utils';

const props = defineProps<{
	class?: HTMLAttributes['class'];
}>();
</script>

<template>
	<td data-slot="table-cell" :class="cn('align-middle px-4', props.class)">
		<slot />
	</td>
</template>
