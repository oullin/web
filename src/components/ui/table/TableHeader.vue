<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@components/lib/utils';

const props = defineProps<{
	class?: HTMLAttributes['class'];
}>();
</script>

<template>
	<thead data-slot="table-header" :class="cn('[&_tr]:border-b [&_tr]:border-[var(--border)]', props.class)">
		<slot />
	</thead>
</template>
