<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@components/lib/utils';
import { usePaginationContext } from './pagination';

interface Props {
	class?: HTMLAttributes['class'];
}

const props = defineProps<Props>();
const pagination = usePaginationContext();
</script>

<template>
	<div data-slot="pagination-content" :class="cn('flex flex-wrap items-center gap-2', props.class)">
		<slot :items="pagination.items.value" />
	</div>
</template>
