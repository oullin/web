<template>
	<div class="rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-gradient-to-t dark:from-slate-800 dark:to-slate-800/30 p-5" :class="[animationClass, props.wrapperClass]">
		<div class="project-card-content">
			<div class="grow">
				<div class="flex items-center justify-between space-x-2">
					<div class="h-10 w-10 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-full mb-2">
						<div class="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
					</div>
					<div class="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-700"></div>
				</div>
				<div class="h-5 bg-slate-200 dark:bg-slate-700 rounded mb-1 w-3/4"></div>
				<div class="space-y-2">
					<div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
					<div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-11/12"></div>
				</div>
			</div>
			<div class="text-sky-500 dark:text-teal-500 flex justify-end">
				<div class="h-3 w-3 rounded bg-slate-200 dark:bg-slate-700"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
	wrapperClass?: string;
	isAnimated?: boolean;
}>();

const animationClass = computed(() => ((props.isAnimated ?? true) ? 'animate-pulse' : null));
</script>
