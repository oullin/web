<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@components/lib/utils';

interface Props {
	class?: HTMLAttributes['class'];
}

const props = defineProps<Props>();
</script>

<template>
	<span aria-hidden="true" data-slot="pagination-ellipsis" :class="cn('page-panel-copy inline-flex items-center px-2 py-2 text-xs uppercase tracking-[0.14em] text-(--muted)', props.class)">
		...
	</span>
</template>
