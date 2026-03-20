<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@components/lib/utils';
import { usePag } from './pagination';

interface Props {
	class?: HTMLAttributes['class'];
}

const props = defineProps<Props>();
const pager = usePag();
</script>

<template>
	<div data-slot="pagination-content" :class="cn('flex flex-wrap items-center gap-2', props.class)">
		<slot :items="pager.items.value" />
	</div>
</template>
