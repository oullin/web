<template>
	<nav v-if="totalPages > 1" class="flex flex-wrap items-center justify-start gap-3 text-sm text-slate-500 dark:text-slate-400" :aria-label="ariaLabel">
		<p class="font-medium">Page {{ currentPage }} of {{ totalPages }}</p>
		<div class="flex items-center gap-2">
			<button
				type="button"
				class="btn h-10 w-32 cursor-pointer border border-fuchsia-500 bg-fuchsia-500 text-white transition-colors duration-150 ease-in-out hover:bg-fuchsia-500/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300 dark:border-teal-500 dark:bg-teal-600 dark:text-slate-900 dark:hover:bg-teal-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:border-slate-700 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
				:disabled="isFirstPage"
				@click="$emit('previous')"
			>
				{{ previousLabel }}
			</button>
			<button
				type="button"
				class="btn h-10 w-32 cursor-pointer border border-fuchsia-500 bg-fuchsia-500 text-white transition-colors duration-150 ease-in-out hover:bg-fuchsia-500/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300 dark:border-teal-500 dark:bg-teal-600 dark:text-slate-900 dark:hover:bg-teal-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:border-slate-700 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
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
