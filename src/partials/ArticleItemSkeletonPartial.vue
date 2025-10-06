<template>
	<article class="py-5 border-b border-slate-100 dark:border-slate-800" :class="animationClass" aria-hidden="true">
		<div class="flex items-start">
			<div
				class="relative block aspect-square w-20 h-20 sm:w-28 sm:h-28 mr-4 sm:mr-6 overflow-hidden rounded-lg bg-slate-200/80 dark:bg-slate-800/80 flex-shrink-0 shadow-sm ring-1 ring-inset ring-slate-200/70 dark:ring-slate-700/70"
			></div>
			<div class="flex-1 space-y-3">
				<div class="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded"></div>
				<div class="h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
				<div class="flex items-start space-x-4">
					<div class="grow space-y-2">
						<div class="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
						<div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-11/12"></div>
						<div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
					</div>
					<div class="hidden lg:flex shrink-0 items-center justify-center w-12">
						<div class="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700"></div>
					</div>
				</div>
			</div>
		</div>
	</article>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
	name: 'ArticleItemSkeletonPartial',
});

const props = defineProps<{
	isAnimated?: boolean;
}>();

const animationClass = computed(() => ((props.isAnimated ?? true) ? 'animate-pulse' : null));
</script>
