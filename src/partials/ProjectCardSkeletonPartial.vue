<template>
	<div class="rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-gradient-to-t dark:from-slate-800 dark:to-slate-800/30 p-5" :class="props.wrapperClass">
		<div class="project-card-content">
			<div class="grow">
				<div class="flex items-center justify-between space-x-2">
					<div class="h-10 w-10 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-full mb-2">
						<Skeleton :class="['h-5 w-5 rounded-full', !props.isAnimated && 'animate-none']" />
					</div>
					<Skeleton :class="['h-5 w-20 rounded-full', !props.isAnimated && 'animate-none']" />
				</div>
				<Skeleton :class="['h-5 mb-1 w-3/4', !props.isAnimated && 'animate-none']" />
				<div class="space-y-2">
					<Skeleton :class="['h-3 w-full', !props.isAnimated && 'animate-none']" />
					<Skeleton :class="['h-3 w-11/12', !props.isAnimated && 'animate-none']" />
				</div>
			</div>
			<div class="text-sky-500 dark:text-teal-500 flex justify-end">
				<Skeleton :class="['h-3 w-3', !props.isAnimated && 'animate-none']" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Skeleton } from '@components/ui/skeleton';

const props = defineProps<{
	wrapperClass?: string;
	isAnimated?: boolean;
}>();
</script>
