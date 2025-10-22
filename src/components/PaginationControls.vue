<template>
	<nav v-if="totalPages > 1" class="mt-6 flex flex-wrap items-center justify-end gap-3 text-sm text-slate-500 dark:text-slate-400" :aria-label="ariaLabel">
		<p class="font-medium">Page {{ currentPage }} of {{ totalPages }}</p>
		<div class="flex items-center gap-2">
			<button type="button" class="pill-button" :disabled="isFirstPage" @click="$emit('previous')">
				{{ previousLabel }}
			</button>
			<button type="button" class="pill-button" :disabled="isLastPage" @click="$emit('next')">
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
