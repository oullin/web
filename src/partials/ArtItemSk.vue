<template>
	<article class="py-5 border-b border-slate-100 dark:border-slate-800" aria-hidden="true" data-testid="article-skeleton">
		<div class="flex items-start">
			<Skeleton :class="['relative block aspect-square w-20 sm:w-28 mr-4 sm:mr-6 overflow-hidden rounded-lg flex-shrink-0 shadow-sm', !props.isAnimated && 'animate-none']" />
			<div class="flex-1 space-y-3">
				<Skeleton :class="['h-3 w-28', !props.isAnimated && 'animate-none']" />
				<Skeleton :class="['h-5 w-3/4', !props.isAnimated && 'animate-none']" />
				<div class="flex items-start space-x-4">
					<div class="grow space-y-2">
						<Skeleton :class="['h-3', !props.isAnimated && 'animate-none']" />
						<Skeleton :class="['h-3 w-11/12', !props.isAnimated && 'animate-none']" />
						<Skeleton :class="['h-3 w-3/4', !props.isAnimated && 'animate-none']" />
					</div>
					<div class="hidden lg:flex shrink-0 items-center justify-center w-12">
						<Skeleton :class="['h-6 w-6 rounded-full', !props.isAnimated && 'animate-none']" />
					</div>
				</div>
			</div>
		</div>
	</article>
</template>

<script setup lang="ts">
import { Skeleton } from '@components/ui/skeleton';

defineOptions({
	name: 'ArticleItemSkeletonPartial',
});

const props = withDefaults(
	defineProps<{
		isAnimated?: boolean;
	}>(),
	{
		isAnimated: true,
	},
);
</script>
