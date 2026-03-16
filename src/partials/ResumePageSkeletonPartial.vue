<template>
	<div data-testid="resume-page-skeleton" class="space-y-12" :aria-hidden="showRefreshButton ? 'false' : 'true'">
		<section class="space-y-8">
			<h2 class="h3 font-aspekta text-slate-800 dark:text-slate-100">Education</h2>
			<ul class="space-y-8">
				<li v-for="item in 2" :key="`resume-education-skeleton-${item}`" class="relative group">
					<div
						class="flex items-start before:absolute before:left-0 before:h-full before:w-px before:bg-slate-200 dark:before:bg-slate-800 before:self-start before:ml-[28px] before:-translate-x-1/2 before:translate-y-8 group-last-of-type:before:hidden"
					>
						<div
							class="absolute left-0 h-14 w-14 flex items-center justify-center border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 bg-white dark:bg-slate-900 rounded-full"
						>
							<Skeleton class="size-8 rounded-full" />
						</div>
						<div class="pl-20 space-y-3 w-full">
							<Skeleton class="h-3 w-32" />
							<Skeleton class="h-4 w-3/4 max-w-[320px]" />
							<Skeleton class="h-4 w-1/2 max-w-[220px]" />
							<div class="space-y-2 pt-1">
								<Skeleton class="h-3 w-full max-w-[520px]" />
								<Skeleton class="h-3 w-5/6 max-w-[440px]" />
							</div>
						</div>
					</div>
				</li>
			</ul>
		</section>
		<section class="space-y-8">
			<h2 class="h2 font-aspekta text-slate-700 dark:text-slate-300">Work Experience</h2>
			<ul class="space-y-8">
				<li v-for="item in 3" :key="`resume-experience-skeleton-${item}`" class="relative group">
					<div
						class="flex items-start before:absolute before:left-0 before:h-full before:w-px before:bg-slate-200 dark:before:bg-slate-800 before:self-start before:ml-[28px] before:-translate-x-1/2 before:translate-y-8 group-last-of-type:before:hidden"
					>
						<div
							class="absolute left-0 h-14 w-14 flex items-center justify-center border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 bg-white dark:bg-slate-900 rounded-full"
						>
							<Skeleton class="size-8 rounded-full" />
						</div>
						<div class="pl-20 space-y-3 w-full">
							<Skeleton class="h-3 w-40" />
							<Skeleton class="h-4 w-3/4 max-w-[360px]" />
							<Skeleton class="h-4 w-1/2 max-w-[240px]" />
							<Skeleton class="h-3 w-full max-w-[520px]" />
							<Skeleton class="h-2.5 w-2/3 max-w-[320px]" />
						</div>
					</div>
				</li>
			</ul>
		</section>
		<section class="space-y-8">
			<h2 class="h3 font-aspekta text-slate-800 dark:text-slate-100">Recommendations</h2>
			<ul class="space-y-8">
				<li v-for="item in 2" :key="`resume-recommendation-skeleton-${item}`" class="relative group">
					<div class="flex items-start">
						<div
							class="absolute left-0 h-14 w-14 flex items-center justify-center border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 bg-white dark:bg-slate-900 rounded-full"
						>
							<Skeleton class="h-14 w-14 rounded-full" />
						</div>
						<div class="pl-20 space-y-3 w-full">
							<Skeleton class="h-4 w-2/3 max-w-[320px]" />
							<Skeleton class="h-4 w-1/2 max-w-[220px]" />
							<div class="flex justify-between text-xs text-slate-400 dark:text-slate-500 pb-2">
								<Skeleton class="h-3 w-24" />
								<Skeleton class="h-3 w-20" />
							</div>
							<div class="space-y-2">
								<Skeleton class="h-3 w-full max-w-[520px]" />
								<Skeleton class="h-3 w-5/6 max-w-[440px]" />
								<Skeleton class="h-3 w-2/3 max-w-[360px]" />
							</div>
						</div>
					</div>
				</li>
			</ul>
		</section>
		<div v-if="showRefreshButton" class="flex justify-center pt-4">
			<button type="button" class="btn bg-fuchsia-500 hover:bg-fuchsia-600 text-white shadow-sm" @click="emit('retry')">Refresh page</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import { Skeleton } from '@components/ui/skeleton';

const props = withDefaults(defineProps<{ showRefreshButton?: boolean }>(), {
	showRefreshButton: false,
});

const emit = defineEmits<{ (_event: 'retry'): void }>();

const showRefreshButton = toRef(props, 'showRefreshButton');
</script>
