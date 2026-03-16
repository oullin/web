<template>
	<div data-testid="post-page-skeleton" class="space-y-8 min-h-[25rem]" aria-hidden="true">
		<div class="mb-3">
			<div class="inline-flex rounded-full border border-slate-200 dark:border-slate-800 w-10 h-10 items-center justify-center bg-slate-100 dark:bg-slate-800/60"></div>
		</div>

		<header class="space-y-4">
			<div class="flex items-center justify-between">
				<Skeleton class="h-3 w-32" />
				<div class="flex items-center space-x-3">
					<Skeleton class="h-8 w-8 rounded-full" />
					<Skeleton class="h-8 w-8 rounded-full" />
					<Skeleton class="h-8 w-8 rounded-full" />
				</div>
			</div>
			<div class="space-y-2">
				<Skeleton class="h-10 w-3/4" />
				<Skeleton class="h-4 w-2/3" />
			</div>
		</header>

		<nav class="mt-6">
			<ul class="flex flex-wrap items-center gap-y-2 text-xs font-semibold uppercase tracking-wide text-slate-300 dark:text-slate-700">
				<li class="flex items-center space-x-2">
					<Skeleton class="h-4 w-16" />
					<span class="text-slate-300 dark:text-slate-700">/</span>
				</li>
				<li class="flex items-center space-x-2">
					<Skeleton class="h-4 w-20" />
					<span class="text-slate-300 dark:text-slate-700">/</span>
				</li>
				<li>
					<Skeleton class="h-4 w-14" />
				</li>
			</ul>
		</nav>

		<div class="space-y-6">
			<Skeleton class="h-4 w-full" />
			<Skeleton class="h-[390px] w-full" />
			<div class="space-y-3">
				<Skeleton class="h-3 w-full" />
				<Skeleton class="h-3 w-11/12" />
				<Skeleton class="h-3 w-10/12" />
				<Skeleton class="h-3 w-full" />
				<Skeleton class="h-3 w-9/12" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Skeleton } from '@components/ui/skeleton';

defineOptions({
	name: 'PostPageSkeletonPartial',
});
</script>
