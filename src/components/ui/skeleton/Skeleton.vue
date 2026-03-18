<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@components/lib/utils';

interface SkeletonProps {
	class?: HTMLAttributes['class'];
}

const props = defineProps<SkeletonProps>();
</script>

<template>
	<div data-slot="skeleton" :class="cn('animate-pulse rounded-md bg-slate-200 dark:bg-slate-700', props.class)" />
</template>
