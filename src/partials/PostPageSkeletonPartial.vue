<template>
	<div data-testid="post-page-skeleton" class="space-y-8 animate-pulse" aria-hidden="true">
		<div class="mb-3">
			<div class="inline-flex rounded-full border border-slate-200 dark:border-slate-800 w-10 h-10 items-center justify-center bg-slate-100 dark:bg-slate-800/60"></div>
		</div>

		<header class="space-y-4">
			<div class="flex items-center justify-between">
				<div class="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
				<div class="flex items-center space-x-3">
					<div class="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
					<div class="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
					<div class="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
				</div>
			</div>
			<div class="space-y-2">
				<div class="h-10 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
				<div class="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
			</div>
		</header>

		<div class="space-y-6">
			<div class="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
			<div class="h-[390px] w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
			<div class="space-y-3">
				<div class="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
				<div class="h-3 w-11/12 bg-slate-200 dark:bg-slate-700 rounded"></div>
				<div class="h-3 w-10/12 bg-slate-200 dark:bg-slate-700 rounded"></div>
				<div class="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
				<div class="h-3 w-9/12 bg-slate-200 dark:bg-slate-700 rounded"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
defineOptions({
	name: 'PostPageSkeletonPartial',
});
</script>
