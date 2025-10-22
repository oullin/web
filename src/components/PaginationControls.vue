<template>
	<nav v-if="totalPages > 1" class="flex flex-wrap items-center justify-start gap-3 text-sm text-slate-500 dark:text-slate-400" :aria-label="ariaLabel">
		<p class="font-medium">Page {{ currentPage }} of {{ totalPages }}</p>
		<div class="flex items-center gap-2">
			<button
				type="button"
				class="inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-fuchsia-400/70 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700/80 dark:text-slate-300 dark:hover:text-slate-100"
				:disabled="isFirstPage"
				@click="$emit('previous')"
			>
				{{ previousLabel }}
			</button>
			<button
				type="button"
				class="inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-fuchsia-400/70 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700/80 dark:text-slate-300 dark:hover:text-slate-100"
				:disabled="isLastPage"
				@click="$emit('next')"
			>
				{{ nextLabel }}
			</button>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
	defineProps<{
		currentPage: number;
		totalPages: number;
		ariaLabel?: string;
		previousLabel?: string;
		nextLabel?: string;
	}>(),
	{
		ariaLabel: 'Pagination',
		previousLabel: 'Previous',
		nextLabel: 'Next',
	},
);

const isFirstPage = computed(() => props.currentPage <= 1);
const isLastPage = computed(() => props.currentPage >= props.totalPages);
</script>
