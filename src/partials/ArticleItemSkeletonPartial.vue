<template>
	<article class="py-5 border-b border-slate-100 dark:border-slate-800" :class="animationClass" aria-hidden="true" data-testid="article-skeleton">
		<div class="flex items-start">
			<div class="relative block rounded-sm w-16 h-16 sm:w-[88px] sm:h-[88px] mr-6 overflow-hidden bg-slate-200 dark:bg-slate-800 flex-shrink-0"></div>
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
